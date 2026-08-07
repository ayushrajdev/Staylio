package app

import (
	config "ApiGateway/config/env"
	"ApiGateway/controllers"
	db "ApiGateway/db/repositories"
	router "ApiGateway/router"
	"ApiGateway/services"
	"net/http"
	"time"
)

type Application struct {
	Config Config
}
type Config struct {
	Addr    string
	Storage db.Storage
}

func New_Application(cfg *Config) *Application {
	return &Application{
		Config: *cfg,
	}
}

func New_Config() *Config {
	port := config.GetString("PORT", ":8080")
	return &Config{
		Addr:    port,
		Storage: *db.NewStorage(),
	}
}

func (app *Application) Run() error {

	userRepository := db.NewUserRepository()
	userService := services.NewUserService(userRepository)
	userController := controllers.NewUserController(userService)
	userRouter := router.NewUserRouter(userController)

	server := &http.Server{
		Addr:         app.Config.Addr,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      router.SetUpRouter(userRouter),
	}
	println("starting server on ", app.Config.Addr)
	return server.ListenAndServe()
}
