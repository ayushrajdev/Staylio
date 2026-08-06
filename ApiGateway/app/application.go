package app

import (
	config "ApiGateway/config/env"
	"net/http"
	"time"
)

type Application struct {
	Config Config
}
type Config struct {
	Addr string
}

func New_Application(cfg *Config) *Application {
	return &Application{
		Config: *cfg,
	}	
}

func New_Config() *Config {
	port:=config.GetString("PORT",":8080")
	return &Config{
		Addr: port,
	}
}

func (app *Application) Run() error {
	server := &http.Server{
		Addr:         app.Config.Addr,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	println("starting server on ", app.Config.Addr)
	return server.ListenAndServe()
}
