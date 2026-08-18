package middlewares

import (
	"context"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

type contextKey string

const (
	UsernameKey contextKey = "username"
	EmailKey    contextKey = "email"
)

var secretKey = []byte("secret-key")

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Get JWT from cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Authentication required", http.StatusUnauthorized)
			return
		}

		tokenString := cookie.Value

		// Parse JWT
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}

			return secretKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Get claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid claims", http.StatusUnauthorized)
			return
		}

		username, ok := claims["username"].(string)
		if !ok {
			http.Error(w, "Username missing from token", http.StatusUnauthorized)
			return
		}

		email, ok := claims["email"].(string)
		if !ok {
			http.Error(w, "Email missing from token", http.StatusUnauthorized)
			return
		}

		// Add values to context
		ctx := context.WithValue(
			r.Context(),
			UsernameKey,
			username,
		)

		ctx = context.WithValue(
			ctx,
			EmailKey,
			email,
		)

		// Pass request with new context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
