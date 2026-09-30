import requests

lands = [
    {
        "land_id": "MP-BPL-001",
        "district": "Bhopal",
        "area_acres": 2.5,
        "owner_name": "Rajesh Sharma",
        "status": "Under Process",
        "compensation_status": "Pending"
    },
    {
        "land_id": "MP-BPL-002",
        "district": "Bhopal",
        "area_acres": 4.2,
        "owner_name": "Amit Verma",
        "status": "Acquired",
        "compensation_status": "Paid"
    },
    {
        "land_id": "MP-SHR-001",
        "district": "Sehore",
        "area_acres": 3.8,
        "owner_name": "Suresh Patel",
        "status": "Disputed",
        "compensation_status": "Pending"
    },
    {
        "land_id": "MP-RSN-001",
        "district": "Raisen",
        "area_acres": 5.1,
        "owner_name": "Mohan Singh",
        "status": "Acquired",
        "compensation_status": "Paid"
    },
    {
        "land_id": "MP-IND-001",
        "district": "Indore",
        "area_acres": 2.9,
        "owner_name": "Vikas Jain",
        "status": "Under Process",
        "compensation_status": "Pending"
    },
    {
        "land_id": "MP-JBL-001",
        "district": "Jabalpur",
        "area_acres": 6.3,
        "owner_name": "Rakesh Yadav",
        "status": "Acquired",
        "compensation_status": "Paid"
    },
    {
        "land_id": "MP-VID-001",
        "district": "Vidisha",
        "area_acres": 3.4,
        "owner_name": "Deepak Mishra",
        "status": "Under Process",
        "compensation_status": "Pending"
    },
    {
        "land_id": "MP-HOS-001",
        "district": "Hoshangabad",
        "area_acres": 4.7,
        "owner_name": "Anil Tiwari",
        "status": "Disputed",
        "compensation_status": "Pending"
    },
    {
        "land_id": "MP-RAJ-001",
        "district": "Rajgarh",
        "area_acres": 2.1,
        "owner_name": "Sunil Kumar",
        "status": "Acquired",
        "compensation_status": "Paid"
    },
    {
        "land_id": "MP-BET-001",
        "district": "Betul",
        "area_acres": 7.2,
        "owner_name": "Pankaj Sharma",
        "status": "Under Process",
        "compensation_status": "Pending"
    }
]


for land in lands:
    response = requests.post(
        "http://127.0.0.1:8000/lands/",
        json=land
    )

    print(land["land_id"], response.status_code)
