package app

import (
	env "ApiGateway/config/db"
	config "ApiGateway/config/env"
	"ApiGateway/controllers"
	db "ApiGateway/db/repositories"
	"ApiGateway/router"
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
	dbconnection, err := env.SetUpDb()
	if err != nil {
		return err
	}
	
	defer dbconnection.Close()
	userRepository := db.NewUserRepository(dbconnection)
	userService := services.NewUserService(userRepository)
	userController := controllers.NewUserController(userService)
	userRouter := router.NewUserRouter(userController)
	
	roleRepository := db.NewRoleRepository(dbconnection)
	rolePermissionRepository := db.NewRolePermissionRepository(dbconnection)
	userRoleRepository := db.NewUserRoleRepository(dbconnection)
	
	roleService := services.NewRoleService(roleRepository, rolePermissionRepository, userRoleRepository)
	roleController := controllers.NewRoleController(roleService)
	roleRouter := router.NewRoleRouter(roleController)
	
	server := &http.Server{
		Addr:         app.Config.Addr,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      router.SetUpRouter(userRouter, roleRouter),
	}
	
	println("starting server on ", app.Config.Addr)
	
	return server.ListenAndServe()
}
