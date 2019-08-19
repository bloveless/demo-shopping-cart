package main

import (
	"errors"
	"github.com/google/uuid"
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

var carts []*Cart
var users []*User
var items = []*Item{
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

func getUsers() []*User {
	return users
}

func createUser(name string) (*User, error) {
	newUserUuid, _ := uuid.NewRandom()
	user := &User{
		ID: newUserUuid.String(),
		Name: name,
	}

	users = append(users, user)
	err := addCartToUser(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func getUser(id string) (*User, error) {
	for _, user := range users {
		if user.ID == id {
			return user, nil
		}
	}

	return nil, nil
}

func getItems() []*Item {
	return items
}

func getItem(id string) (*Item, error) {
	for _, item := range items {
		if item.ID == id {
			return item, nil
		}
	}

	return nil, nil
}

func getCarts() []*Cart {
	return carts
}

func getCart(id string) (*Cart, error) {
	for _, cart := range carts {
		if cart.ID == id {
			return cart, nil
		}
	}

	return nil, nil
}

func addCartToUser(user *User) error {
	if user == nil {
		return errors.New("user does not exist")
	}

	cartUuid, _ := uuid.NewRandom()
	cart := &Cart{
		ID: cartUuid.String(),
	}

	user.Carts = append(user.Carts, cart)
	carts = append(carts, cart)

	return nil
}

func addItemToCart(cart *Cart, item *Item, quantity int) (*CartItem, error) {
	if cart == nil || item == nil || quantity < 0 {
		return nil, errors.New("cannot add item to cart: invalid item, cart, or quantity")
	}

	if cart.Items != nil {
		for _, cartItem := range cart.Items {
			if cartItem.Item.ID == item.ID {
				cartItem.Quantity += quantity
				return cartItem, nil
			}
		}
	}

	cartItemUuid, _ := uuid.NewRandom()
	cartItem := &CartItem{
		ID: cartItemUuid.String(),
		Quantity: quantity,
		Item: item,
	}
	cart.Items = append(cart.Items, cartItem)

	return cartItem, nil
}
