package main

import (
	"github.com/graphql-go/handler"
	"log"
	"net/http"
)

func main() {
	schema := getSchema()

	h := handler.New(&handler.Config{
		Schema: &schema,
		Pretty: true,
		GraphiQL: true,
	})

	http.Handle("/graphql", h)
	log.Fatal(http.ListenAndServe(":4000", nil))
}
