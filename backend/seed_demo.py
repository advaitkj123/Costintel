import sys
import os
from datetime import datetime, timedelta
import random

# Add backend to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.cost import CostRecord
from app.models.anomaly import AnomalyRecord
from app.models.optimization_action import OptimizationAction

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Clear existing data for a clean demo
    db.query(CostRecord).delete()
    db.query(AnomalyRecord).delete()
    db.query(OptimizationAction).delete()
    
    services = ["AmazonEC2", "AmazonS3", "AWSLambda", "AmazonRDS"]
    today = datetime.now()
    
    print("Seeding costs...")
    for i in range(14): # 2 weeks of data
        date = today - timedelta(days=i)
        for service in services:
            # Normal cost with some noise
            base = 100 if service == "AmazonEC2" else 50
            amount = base + random.uniform(0, 20)
            
            # Create a spike for EC2 3 days ago
            if service == "AmazonEC2" and i == 3:
                amount = 250 # Big spike
                
            db.add(CostRecord(service=service, date=date, amount=round(amount, 2)))
    
    print("Seeding anomalies...")
    # Add a manual anomaly with insight
    ec2_anomaly = AnomalyRecord(
        service="AmazonEC2",
        date=today - timedelta(days=3),
        expected_cost=110.50,
        actual_cost=250.00,
        severity="critical",
        status="detected",
        insight="Unexpected auto-scaling event in us-east-1 triggered by a surge in health check failures, leading to 5 additional t3.large instances being provisioned."
    )
    db.add(ec2_anomaly)
    
    s3_anomaly = AnomalyRecord(
        service="AmazonS3",
        date=today - timedelta(days=1),
        expected_cost=45.00,
        actual_cost=82.00,
        severity="high",
        status="detected",
        insight="High PUT request volume detected in the 'prod-logs' bucket. Investigations suggest a misconfigured log rotation script."
    )
    db.add(s3_anomaly)
    
    print("Seeding optimization actions...")
    actions = [
        OptimizationAction(
            description="Terminated 3 unattached EBS volumes",
            service="AmazonEC2",
            savings_estimate=12.45,
            status="success"
        ),
        OptimizationAction(
            description="Moved 200GB from S3 Standard to Glacier",
            service="AmazonS3",
            savings_estimate=45.00,
            status="success"
        ),
        OptimizationAction(
            description="Released 5 unused Elastic IPs",
            service="AmazonEC2",
            savings_estimate=18.50,
            status="success"
        ),
        OptimizationAction(
            description="Optimized DynamoDB provisioned throughput",
            service="AmazonRDS",
            savings_estimate=8.20,
            status="success"
        )
    ]
    for action in actions:
        db.add(action)
        
    db.commit()
    db.close()
    print("Seed completed successfully!")

if __name__ == "__main__":
    seed_data()
