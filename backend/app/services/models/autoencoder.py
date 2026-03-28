import torch
import torch.nn as nn

class AnomalyAutoencoder(nn.Module):
    """
    A simple symmetric Autoencoder to learn normal infrastructure patterns.
    High reconstruction error indicates a "local" anomaly that deviates from 
    learned historical correlations between features.
    """
    def __init__(self, input_dim: int):
        super(AnomalyAutoencoder, self).__init__()
        
        # Encoder: Compresses input into a "bottleneck"
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 8),
            nn.ReLU(),
            nn.Linear(8, 4),
            nn.ReLU()
        )
        
        # Decoder: Attempts to reconstruct the original input from the bottleneck
        self.decoder = nn.Sequential(
            nn.Linear(4, 8),
            nn.ReLU(),
            nn.Linear(8, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

def calculate_reconstruction_error(model: nn.Module, data: torch.Tensor) -> torch.Tensor:
    model.eval()
    with torch.no_grad():
        reconstructed = model(data)
        # Mean Squared Error per sample
        mse = torch.mean((data - reconstructed)**2, dim=1)
    return mse
