package middlewares

import (
	"ApiGateway/dtos"
	"ApiGateway/utils"
	"context"
	"fmt"
	"net/http"
)

func ValidateLoginUserRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// before handler
		var payload dtos.VerifyUserDTO

		// JSON -> struct
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			fmt.Println("error while reading the request body:", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// struct validation
		if err := utils.Validator.Struct(payload); err != nil {
			fmt.Println("validation error:", err)
			http.Error(w, "Validation failed", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "payload", payload)
		next.ServeHTTP(w, r.WithContext(ctx))

		// after handler
	})
}
func ValidateCreateUserRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// before handler
		var payload dtos.CreateUserDTO

		// JSON -> struct
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			fmt.Println("error while reading the request body:", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// struct validation
		if err := utils.Validator.Struct(payload); err != nil {
			fmt.Println("validation error:", err)
			http.Error(w, "Validation failed", http.StatusBadRequest)
			return
		}
		ctx := context.WithValue(r.Context(), "payload", payload)
		next.ServeHTTP(w, r.WithContext(ctx))

		// after handler
	})
}
