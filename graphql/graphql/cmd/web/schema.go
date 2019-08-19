package main

import (
	"fmt"
	"github.com/graphql-go/graphql"
	"log"
)

func getSchema() graphql.Schema {
	var itemType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Item",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.ID,
				},
				"sku": &graphql.Field{
					Type: graphql.String,
				},
				"name": &graphql.Field{
					Type: graphql.String,
				},
				"price": &graphql.Field{
					Type: graphql.Float,
				},
			},
		},
	)

	var cartItemType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "CartItem",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.ID,
				},
				"quantity": &graphql.Field{
					Type: graphql.Int,
				},
				"item": &graphql.Field{
					Type: itemType,
				},
			},
		},
	)

	var cartType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Cart",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.ID,
				},
				"items": &graphql.Field{
					Type: graphql.NewList(cartItemType),
				},
			},
		},
	)

	var userType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "User",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.ID,
				},
				"name": &graphql.Field{
					Type: graphql.String,
				},
				"carts": &graphql.Field{
					Type: graphql.NewList(cartType),
				},
			},
		},
	)

	fields := graphql.Fields{
		"users": &graphql.Field{
			Type:        graphql.NewList(userType),
			Description: "",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return getUsers(), nil
			},
		},
		"carts": &graphql.Field{
			Type:        graphql.NewList(cartType),
			Description: "",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return getCarts(), nil
			},
		},
		"items": &graphql.Field{
			Type:        graphql.NewList(itemType),
			Description: "",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return getItems(), nil
			},
		},
		"user": &graphql.Field{
			Type:        userType,
			Description: "",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, ok := p.Args["id"]
				if ok {
					user, _ := getUser(id.(string))
					return user, nil
				}

				return nil, nil
			},
		},
		"cart": &graphql.Field{
			Type:        cartType,
			Description: "",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, ok := p.Args["id"]
				if ok {
					cart, _ := getCart(id.(string))
					return cart, nil
				}
				return nil, nil
			},
		},
		"item": &graphql.Field{
			Type:        itemType,
			Description: "",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.ID,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, ok := p.Args["id"]
				if ok {
					item, _ := getItem(id.(string))
					return item, nil
				}
				return nil, nil
			},
		},
	}

	mutationType := graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Mutation",
			Fields: graphql.Fields{
				"createUser": &graphql.Field{
					Type: userType,
					Description: "",
					Args: graphql.FieldConfigArgument{
						"name": &graphql.ArgumentConfig{
							Type:         graphql.NewNonNull(graphql.String),
						},
					},
					Resolve: func(params graphql.ResolveParams) (interface{}, error) {
						name := params.Args["name"].(string)
						user, _ := createUser(name)
						return user, nil
					},
				},
				"addCartToUser": &graphql.Field{
					Type: userType,
					Description: "",
					Args: graphql.FieldConfigArgument{
						"userID": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
					},
					Resolve: func(params graphql.ResolveParams) (interface{}, error) {
						user, _ := getUser(params.Args["userID"].(string))
						if user != nil {
							err := addCartToUser(user)
							if err != nil {
								fmt.Printf("error: %v\n", err)
								return nil, err
							}

							return user, nil
						}

						return nil, nil
					},
				},
				"addItemToCart": &graphql.Field{
					Type:        cartType,
					Description: "",
					Args: graphql.FieldConfigArgument{
						"cartID": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
						"itemID": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
						"quantity": &graphql.ArgumentConfig{
							Type:         graphql.NewNonNull(graphql.Int),
						},
					},
					Resolve: func(params graphql.ResolveParams) (interface{}, error) {
						item, _ := getItem(params.Args["itemID"].(string))
						cart, _ := getCart(params.Args["cartID"].(string))
						quantity := params.Args["quantity"].(int)
						if item != nil && cart != nil {
							_, err := addItemToCart(cart, item, quantity)
							if err != nil {
								fmt.Printf("error: %v\n", err)
								return nil, err
							}

							return cart, nil
						}

						return nil, fmt.Errorf("cart %v, item %v, quantity %d", cart, item, quantity)
					},
				},
			},
		},
	)

	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery), Mutation: mutationType}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	return schema
}
