from app.db.session import SessionLocal
from app.models.resource import Resource, ResourceType, ResourceStatus
from app.db.repositories.resource_repository import ResourceRepository

def seed_db():
    db = SessionLocal()
    repo = ResourceRepository(db)
    
    if len(repo.list_all()) > 0:
        print("Database already seeded")
        return

    resources = [
        Resource(
            name="web-server-01",
            type=ResourceType.ec2,
            region="us-east-1",
            status=ResourceStatus.running,
            provider="simulated",
            external_id="i-demo12345",
            instance_type="t3.medium"
        ),
        Resource(
            name="api-gateway-lambda",
            type=ResourceType.lambda_fn,
            region="us-east-1",
            status=ResourceStatus.active,
            provider="simulated",
            external_id="arn:aws:lambda:us-east-1:demo:function:api",
        ),
        Resource(
            name="static-assets-bucket",
            type=ResourceType.s3,
            region="us-east-1",
            status=ResourceStatus.active,
            provider="simulated",
            external_id="bucket-static-assets-demo",
        ),
    ]
    
    for r in resources:
        repo.create(r)
        
    db.commit()
    print(f"Seeded {len(resources)} resources.")

if __name__ == "__main__":
    seed_db()
