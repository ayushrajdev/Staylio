package middlewares

import (
	"ApiGateway/config/db"
	repo "ApiGateway/db/repositories"
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strconv"
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
func ProxyAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		// r.Header.Set("X-User-Id", strconv.Itoa(claims.UserID))
		r.Header.Set("X-Username", username)
		r.Header.Set("X-Email", email)

		next.ServeHTTP(w, r)

		// JWT is valid

	})
}

func RequireAllRoles(roles ...string) func(http.Handler) http.Handler {

	// function that can create a middleware for checking the above set of roles

	return func(next http.Handler) http.Handler {

		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			userIdStr := r.Context().Value("userId").(string)
			userId, err := strconv.ParseInt(userIdStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			dbConn, dbErr := config.SetUpDb()
			if dbErr != nil {
				http.Error(w, "Database connection error: "+dbErr.Error(), http.StatusInternalServerError)
				return
			}
			defer dbConn.Close()

			urr := repo.NewUserRoleRepository(dbConn)

			hasAllRoles, hasAllRolesErr := urr.HasAllRoles(userId, roles)
			fmt.Println("userid", userId, "roles", roles, "hasAllRoles", hasAllRoles)
			if hasAllRolesErr != nil {
				http.Error(w, "Error checking user roles: "+hasAllRolesErr.Error(), http.StatusInternalServerError)
				return
			}

			if !hasAllRoles {
				http.Error(w, "Forbidden: You do not have the required roles", http.StatusForbidden)
				return
			}

			fmt.Println("User has all required roles:", roles)

			next.ServeHTTP(w, r)
		})
	}

}

func RequireAnyRole(roles ...string) func(http.Handler) http.Handler {

	return func(next http.Handler) http.Handler {

		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			userIdStr := r.Context().Value("userID").(string)
			userId, err := strconv.ParseInt(userIdStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			dbConn, dbErr := config.SetUpDb()
			if dbErr != nil {
				http.Error(w, "Database connection error: "+dbErr.Error(), http.StatusInternalServerError)
				return
			}

			urr := repo.NewUserRoleRepository(dbConn)

			hasAnyRole, hasAnyRolesErr := urr.HasAnyRole(userId, roles)
			fmt.Println("userid", userId, "roles", roles, "hasAnyRole", hasAnyRole)
			if hasAnyRolesErr != nil {
				http.Error(w, "Error checking user roles: "+hasAnyRolesErr.Error(), http.StatusInternalServerError)
				return
			}

			if !hasAnyRole {
				http.Error(w, "Forbidden: You do not have the required roles", http.StatusForbidden)
				return
			}

			fmt.Println("User has all required roles:", roles)

			next.ServeHTTP(w, r)
		})
	}
}
