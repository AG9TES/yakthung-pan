package com.yakthung.pan;

import android.os.Bundle;
import android.os.Build;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.PermissionRequest;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import androidx.appcompat.app.AppCompatActivity;

import java.io.InputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private static final int PERMISSION_REQ_CODE = 2001;
    private static final int RC_GOOGLE_SIGN_IN = 9001;
    private GoogleSignInClient mGoogleSignInClient;

    private static final String WEB_CLIENT_ID = "923150025349-92q8j8447cedud48e68pp2ungs0b82b9.apps.googleusercontent.com";

    public class WebAppInterface {
        @JavascriptInterface
        public void promptNativeGoogleSignIn() {
            MainActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if (mGoogleSignInClient != null) {
                            mGoogleSignInClient.signOut();
                            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
                            startActivityForResult(signInIntent, RC_GOOGLE_SIGN_IN);
                        }
                    } catch (Exception e) {
                        Log.e("YakthungPan", "Native Google Sign-In intent error: " + e.getMessage(), e);
                    }
                }
            });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        supportRequestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        // Configure Google Sign-In with Web Client ID to request ID Token
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(WEB_CLIENT_ID)
                .requestEmail()
                .requestProfile()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        webView = new WebView(this);
        setContentView(webView);

        // Native Google Sign-In JavaScript Bridge
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidNativeGoogleAuth");

        android.webkit.CookieManager cookieManager = android.webkit.CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(true);

        String defaultUa = settings.getUserAgentString();
        String chromeUa = defaultUa.replace("; wv", "");
        settings.setUserAgentString(chromeUa);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                request.grant(request.getResources());
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("YakthungPanJS", consoleMessage.message() + " -- Line " +
                        consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedSslError(WebView view, android.webkit.SslErrorHandler handler, android.net.http.SslError error) {
                handler.proceed();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                String path = request.getUrl().getPath();
                if (url.startsWith("https://localhost/") || url.startsWith("http://localhost/") || url.startsWith("file:///android_asset/")) {
                    if (path == null || path.equals("/") || path.isEmpty()) {
                        path = "/index.html";
                    }
                    try {
                        String assetPath = path;
                        if (assetPath.startsWith("/android_asset/")) {
                            assetPath = assetPath.substring("/android_asset/".length());
                        } else if (assetPath.startsWith("/")) {
                            assetPath = assetPath.substring(1);
                        }
                        if (assetPath.isEmpty() || assetPath.equals("index.html")) {
                            assetPath = "index.html";
                        }
                        InputStream is = null;
                        try {
                            is = getAssets().open(assetPath);
                        } catch (IOException e1) {
                            try {
                                is = getAssets().open(assetPath.replace('\\', '/'));
                            } catch (IOException e2) {
                                is = null;
                            }
                        }
                        if (is == null) {
                            Log.e("YakthungPanAsset", "Asset not found: " + assetPath);
                            return null;
                        }
                        String mimeType = getMimeType(assetPath);
                        String encoding = isBinary(assetPath) ? null : "UTF-8";
                        return new WebResourceResponse(mimeType, encoding, is);
                    } catch (Exception e) {
                        return null;
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            private boolean isBinary(String path) {
                return path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg") ||
                       path.endsWith(".mp3") || path.endsWith(".wav") || path.endsWith(".ogg") ||
                       path.endsWith(".ico");
            }

            private String getMimeType(String path) {
                if (path.endsWith(".html")) return "text/html";
                if (path.endsWith(".js")) return "application/javascript";
                if (path.endsWith(".css")) return "text/css";
                if (path.endsWith(".json")) return "application/json";
                if (path.endsWith(".png")) return "image/png";
                if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
                if (path.endsWith(".svg")) return "image/svg+xml";
                if (path.endsWith(".mp3")) return "audio/mpeg";
                if (path.endsWith(".wav")) return "audio/wav";
                return "application/octet-stream";
            }
        });

        requestAppPermissions();
        webView.loadUrl("https://localhost/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_GOOGLE_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                if (account != null) {
                    final String email = account.getEmail() != null ? account.getEmail().replace("'", "\\'") : "";
                    final String name = account.getDisplayName() != null ? account.getDisplayName().replace("'", "\\'") : "";
                    final String photoUrl = account.getPhotoUrl() != null ? account.getPhotoUrl().toString().replace("'", "\\'") : "";
                    final String idToken = account.getIdToken() != null ? account.getIdToken().replace("'", "\\'") : "";

                    if (webView != null) {
                        webView.post(new Runnable() {
                            @Override
                            public void run() {
                                String js = "if (typeof onNativeGoogleSignInSuccess === 'function') { " +
                                            "onNativeGoogleSignInSuccess('" + email + "', '" + name + "', '" + photoUrl + "', '" + idToken + "'); }";
                                webView.evaluateJavascript(js, null);
                            }
                        });
                    }
                }
            } catch (ApiException e) {
                Log.w("YakthungPan", "Native Google sign-in failed, statusCode: " + e.getStatusCode());
                final int code = e.getStatusCode();
                if (webView != null) {
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript("if (typeof onNativeGoogleSignInError === 'function') { onNativeGoogleSignInError(" + code + "); }", null);
                        }
                    });
                }
            }
        }
    }

    private void requestAppPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            List<String> permissions = new ArrayList<String>();
            if (checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(android.Manifest.permission.RECORD_AUDIO);
            }
            if (Build.VERSION.SDK_INT >= 33) {
                if (checkSelfPermission("android.permission.READ_MEDIA_AUDIO") != PackageManager.PERMISSION_GRANTED) {
                    permissions.add("android.permission.READ_MEDIA_AUDIO");
                }
                if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
                    permissions.add("android.permission.POST_NOTIFICATIONS");
                }
            } else {
                if (checkSelfPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    permissions.add(android.Manifest.permission.READ_EXTERNAL_STORAGE);
                }
                if (checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    permissions.add(android.Manifest.permission.WRITE_EXTERNAL_STORAGE);
                }
            }
            if (!permissions.isEmpty()) {
                requestPermissions(permissions.toArray(new String[0]), PERMISSION_REQ_CODE);
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
