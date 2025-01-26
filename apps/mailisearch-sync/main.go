package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/lib/pq"
	"github.com/meilisearch/meilisearch-go"
)

func main() {
	if os.Getenv("ENVIRONMENT") == "development" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("ERROR LOADING .env", err)
		}
	}

	connStr := os.Getenv("DB_LINK")
	_, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	listener := pq.NewListener(connStr, 10*time.Second, time.Minute, nil)
	err = listener.Listen("cell_changes")
	if err != nil {
		log.Fatal(err)
	}

	err = listener.Listen("cell_deletion")
	if err != nil {
		log.Fatal(err)
	}

	client := meilisearch.New("http://localhost:7700", meilisearch.WithAPIKey(os.Getenv("MAILI_MASTER_KEY")))

	log.Println("Listening to db on cell_changes and cell_deletion!")

	for {
		notif := <-listener.Notify

		var payload map[string]any
		if err := json.Unmarshal([]byte(notif.Extra), &payload); err != nil {
			log.Println("ERROR UNMARSHAL CHANGES:", err)
		}

		switch notif.Channel {
		case "cell_deletion":
			if data, ok := payload["data"].(map[string]any); ok {
				if id, ok := data["id"].(float64); ok {
					log.Println("DELETING DOCUMENT", payload)
					task, err := client.Index("cells").DeleteDocument(fmt.Sprintf("%d", int(id)))
					log.Println("TASK:", task)
					if err != nil {
						log.Println("ERROR:", err)
					}
				}
			}
		case "cell_changes":
			log.Println("ADDING DOCUMENT", payload)
			task, err := client.Index("cells").AddDocuments(payload["data"], "id")
			log.Println("TASK:", task)
			if err != nil {
				log.Println("ERROR:", err)
			}
		}

	}
}
