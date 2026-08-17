package middlewares

import (
	"log"
	"net/http"
	"golang.org/x/time/rate"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		log.Printf("%s %s", r.Method, r.URL.Path)

		next.ServeHTTP(w, r)
	})
}

func RateLimiter(next http.Handler) http.Handler {
	limiter := rate.NewLimiter(rate.Limit(10), 20)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if !limiter.Allow() {
			http.Error(
				w,
				"Too many requests",
				http.StatusTooManyRequests,
			)
			return
		}
		next.ServeHTTP(w, r)
	})
}
