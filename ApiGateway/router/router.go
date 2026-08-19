package router

import (
	config "ApiGateway/config"
	"ApiGateway/middlewares"
	"ApiGateway/utils/helpers"
	"github.com/go-chi/chi/v5"
)

type Router interface {
	Register(r chi.Router)
}

func SetUpRouter(userRouter Router) *chi.Mux {
	chiRouter := chi.NewRouter()

	chiRouter.Use(middlewares.Logger)
	chiRouter.Use(middlewares.RateLimiter)

	hotelsService := &config.ServiceConfig{
		ResourceName: "hotels",
		BaseURL:      "http://localhost:4000",
	}

	hotelsProxy := helpers.CreateVersionedProxy(hotelsService.BaseURL, hotelsService.ResourceName)

	chiRouter.Route("/api/hotels", func(r chi.Router) {

		// Public
		// r.Get("/", hotelsProxy)
		// r.Get("/{id}", hotelsProxy)
		r.Handle("/*", hotelsProxy)
		// Protected
		r.Group(func(r chi.Router) {
			r.Use(middlewares.ProxyAuthMiddleware)
			r.Post("/", hotelsProxy)
			r.Put("/{id}", hotelsProxy)
			r.Delete("/{id}", hotelsProxy)
		})
	})

	userRouter.Register(chiRouter)

	return chiRouter
}
