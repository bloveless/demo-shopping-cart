package main

import (
	"github.com/graphql-go/graphql"
	"log"
)

type User struct {
	ID    string
	Name  string
	Carts []*Cart
}

type Item struct {
	ID    string
	Sku   string
	Name  string
	Price float64
}

type CartItem struct {
	ID       string
	Item     *Item
	Quantity int
}

type Cart struct {
	ID    string
	Items []*CartItem
}

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

	items := []*Item{
		{
			ID:    "1399f8ea-3173-40ec-8fef-ef247348fadb",
			Sku:   "US-1235-01",
			Name:  "Lethal White",
			Price: 35.99,
		},
		{
			ID:    "3b418bdb-56d1-41d7-a2bf-0b642278aa9e",
			Sku:   "US-1236-01",
			Name:  "Killing Reagan",
			Price: 15.99,
		},
		{
			ID:    "d9e9a7c8-69ef-4edd-ac4a-8937ac1863d5",
			Sku:   "US-1234-01",
			Name:  "Go Programming",
			Price: 24.99,
		},
	}

	brennonCart := Cart{
		ID: "2ebab75e-037b-4935-a848-74c3a99cebe0",
		Items: []*CartItem{
			{
				ID:       "cd8bf860-c819-48e6-8f5d-899ec8be0af4",
				Item:     items[0],
				Quantity: 1,
			},
			{
				ID:       "dc50c278-d11e-4c9a-a04a-d54c79d3f6ea",
				Item:     items[1],
				Quantity: 1,
			},
		},
	}

	jamieCart := Cart{
		ID: "1945130b-4b6e-4df0-aac4-daeff6ef0c21",
		Items: []*CartItem{
			{
				ID:       "0139911f-1d31-41b7-86a7-2cd89b19b52a",
				Item:     items[0],
				Quantity: 1,
			},
			{
				ID:       "a9f8a1bc-384d-4d02-a2a3-45e15a4ef477",
				Item:     items[2],
				Quantity: 1,
			},
		},
	}

	carts := []Cart{
		brennonCart,
		jamieCart,
	}

	users := []User{
		{
			ID:   "7aea4b8f-a041-4a88-aee1-df3ebca92003",
			Name: "Brennon Loveless",
			Carts: []*Cart{
				&brennonCart,
			},
		},
		{
			ID:   "80ee6109-5057-4024-842e-289e6fbb2522",
			Name: "Jamie Loveless",
			Carts: []*Cart{
				&jamieCart,
			},
		},
	}

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
				return users, nil
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
				return carts, nil
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
				return items, nil
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
					for _, user := range users {
						if user.ID == id {
							return user, nil
						}
					}
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
					for _, cart := range carts {
						if cart.ID == id {
							return cart, nil
						}
					}
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
					for _, item := range items {
						if item.ID == id {
							return item, nil
						}
					}
				}
				return nil, nil
			},
		},
	}
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	return schema
}
