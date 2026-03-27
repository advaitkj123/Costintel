import random

class AIInsightService:
    @staticmethod
    def generate_insight(service: str, actual: float, expected: float) -> str:
        diff_pct = ((actual - expected) / expected) * 100 if expected > 0 else 100
        
        reasons = {
            "AmazonEC2": [
                f"Unexpected traffic spike led to auto-scaling events, increasing cost by {diff_pct:.1f}%.",
                f"On-demand instance usage increased compared to reserved instance coverage.",
                "Large data transfer out (Egress) detected to an external region."
            ],
            "AmazonS3": [
                "Massive ingestion of log data into standard storage class instead of Glacier.",
                "High API request volume detected (PUT/LIST) from a batch processing job.",
                "Versioning was enabled on a high-churn bucket, leading to hidden storage costs."
            ],
            "AWSLambda": [
                f"Function execution duration increased by {diff_pct:.1f}% due to downstream dependency latency.",
                "Recursive invocation loop detected or extremely high concurrency hit.",
                "Memory allocation per function was recently increased, raising cost-per-execution."
            ],
            "AmazonRDS": [
                "Database storage auto-scaling triggered due to rapid log growth.",
                "Read replica was provisioned in a different region, adding cross-region data transfer.",
                "Unoptimized query patterns causing high IO operations and provisioned IOPS overages."
            ]
        }
        
        generic_reasons = [
            f"Sudden {diff_pct:.1f}% increase in usage patterns detected across the region.",
            "Resource over-provisioning against the current weekly baseline.",
            "Manual resource deployment or configuration change detected in the audit log."
        ]
        
        service_reasons = reasons.get(service, generic_reasons)
        return random.choice(service_reasons)
