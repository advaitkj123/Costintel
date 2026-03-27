import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AWSCostService:
    def __init__(self):
        # Only initialize if we have credentials (in a real app, IAM roles might be used)
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            self.client = boto3.client(
                'ce',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_DEFAULT_REGION
            )
        else:
            # Fallback to default credential provider chain (e.g. AWS CLI config, IAM)
            self.client = boto3.client('ce', region_name=settings.AWS_DEFAULT_REGION)

    def fetch_daily_costs(self, days: int = 7):
        """
        Fetch daily cost for last 7 days from AWS Cost Explorer API
        Grouped by Service.
        """
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)

        try:
            response = self.client.get_cost_and_usage(
                TimePeriod={
                    'Start': start_date.strftime('%Y-%m-%d'),
                    'End': end_date.strftime('%Y-%m-%d')
                },
                Granularity='DAILY',
                Metrics=['UnblendedCost'],
                GroupBy=[
                    {
                        'Type': 'DIMENSION',
                        'Key': 'SERVICE'
                    }
                ]
            )
            return self._parse_cost_response(response)
        except ClientError as e:
            logger.error(f"AWS ClientError fetching costs: {e}")
            raise Exception(f"Failed to fetch AWS costs: {str(e)}")

    def _parse_cost_response(self, response):
        parsed_data = []
        for result_by_time in response.get('ResultsByTime', []):
            date_str = result_by_time['TimePeriod']['Start']
            for group in result_by_time.get('Groups', []):
                service_name = group['Keys'][0]
                amount = float(group['Metrics']['UnblendedCost']['Amount'])
                currency = group['Metrics']['UnblendedCost']['Unit']
                if amount > 0:
                    parsed_data.append({
                        "date": date_str,
                        "service": service_name,
                        "amount": amount,
                        "currency": currency
                    })
        return parsed_data
