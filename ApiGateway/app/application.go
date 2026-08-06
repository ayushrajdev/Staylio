package app

import (
	"net/http"
	"time"
)

type Application struct {
	Config Config
}
type Config struct {
	Addr string
}

func (app *Application) Run() error {
	server := &http.Server{
		Addr: app.Config.Addr,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	println("starting server on ", app.Config.Addr)
	return server.ListenAndServe()
}
