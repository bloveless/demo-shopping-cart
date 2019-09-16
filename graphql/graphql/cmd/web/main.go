package main

import (
	"fmt"
	"github.com/go-http-utils/logger"
	"github.com/graphql-go/handler"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

func main() {
	schema := getSchema()

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   false,
		GraphiQL: true,
	})

	mux := http.NewServeMux()
	mux.Handle("/graphql", h)

	// cors.Default() setup the middleware with default options being
	// all origins accepted with simple methods (GET, POST). See
	// documentation below for more options.
	corsHandler := cors.Default().Handler(mux)

	fmt.Println("Starting server on :4000")
	log.Fatal(http.ListenAndServe(":4000", logger.Handler(corsHandler, os.Stdout, logger.DevLoggerType)))
}
