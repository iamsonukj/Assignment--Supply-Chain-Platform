# Supply Chain Intelligence Platform

A full-stack analytics platform designed to monitor, predict, and analyze shipment delays across supply chain operations. The platform provides real-time shipment monitoring, risk intelligence, predictive analytics, and carrier anomaly detection.

---

## Project Overview

The **Supply Chain Intelligence Platform** helps logistics teams make data-driven decisions by providing:

* Shipment tracking and monitoring
* Delay prediction using Machine Learning
* Route risk analysis
* Carrier anomaly detection
* Operational KPI dashboards

This system combines **FastAPI**, **MongoDB**, **ReactJS**, **Docker**, and **Machine Learning models** into a unified platform.

---

## Features

### 1. Operations Overview Dashboard

Displays:

* Total Shipments
* Total Delayed Shipments
* Total In Transit Shipments
* Average Delay Days
* Shipment Status Distribution Chart
* Top 5 High-Risk Routes Chart

API Used:

```bash
GET /dashboard/summary
```

---

### 2. Shipment Monitor

Features:

* Shipment data table
* Filters by:

  * Status
  * Carrier
  * Risk Level
* Pagination support
* Clickable rows for shipment details modal

API Used:

```bash
GET /shipments
GET /shipments/{shipment_id}
```

---

### 3. Predict Shipment

Users can input shipment details and get:

* Delay prediction
* Delay probability
* Estimated delay days
* Risk level
* Progress bar visualization

API Used:

```bash
POST /shipments/predict
```

---

### 4. Carrier & Route Intelligence

Displays:

#### Carrier Intelligence:

* Carrier anomaly detection
* Delay rate
* Average delay days

#### Route Intelligence:

* Route risk score
* Historical delay rate
* Customs hold rate
* Sortable risk score

APIs Used:

```bash
GET /carriers/anomalies
GET /routes/risk
```

---

## Tech Stack

### Frontend

* ReactJS
* React Router
* Axios
* Chart.js
* Tailwind CSS

### Backend

* FastAPI
* Python
* Joblib
* Scikit-learn
* Pandas
* NumPy

### Database

* MongoDB

### DevOps

* Docker
* Docker Compose

---

## Project Structure

```text
Projet/
│
├── backend/
│   ├── main.py
│   ├── db.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── pipeline_output.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── models/
│   ├── delay_classifier.pkl
│   └── delay_regressor.pkl
│
├── docker-compose.yml
├── .env
└── README.md
```

---

## Installation (Local Setup)

### 1. Clone Repository

```bash
git clone <repository_url>
cd Projet
```

---

### 2. Setup Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

Swagger docs:

```bash
http://localhost:8000/docs
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

### 4. MongoDB Setup

Ensure MongoDB is running locally on:

```bash
mongodb://localhost:27017
```

Database name:

```bash
freightiq
```

---

## Docker Setup

### Build and Run

```bash
docker compose up --build
```

Services:

* Frontend → localhost:3000
* Backend → localhost:8000
* MongoDB → localhost:27017

Stop:

```bash
docker compose down
```

---

## Environment Variables

Create `.env` file:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=freightiq
```

For Docker:

```env
MONGO_URI=mongodb://mongodb:27017
DB_NAME=freightiq
```

---

## API Endpoints

### Dashboard

```bash
GET /dashboard/summary
```

### Shipments

```bash
GET /shipments
GET /shipments/{shipment_id}
POST /shipments/predict
```

### Carriers

```bash
GET /carriers/anomalies
```

### Routes

```bash
GET /routes/risk
```

---

## UI Features

* Responsive dashboard
* Interactive charts
* Loading spinners
* Progress bars
* Modal views
* Hover effects
* Footer branding
* Pagination
* Error handling

---

## Author

**Made with ❤️ by Sonu Kumar**
