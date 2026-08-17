package helpers

import (
	"net/http"
	"time"
)

func SetResponseCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",                            // Accessible across the entire domain
		Expires:  time.Now().Add(24 * time.Hour), // Cookie longevity
		HttpOnly: true,                           // Protects against XSS attacks
		Secure:   true,                           // Ensures cookie is sent over HTTPS only
		SameSite: http.SameSiteStrictMode,        // Mitigates CSRF attacks
	}

	http.SetCookie(w, cookie)

}