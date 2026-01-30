package com.prisma.controller;

import com.prisma.entity.PortfolioAsset;
import com.prisma.entity.CryptoWatchlist;
import com.prisma.repository.PortfolioAssetRepository;
import com.prisma.repository.CryptoWatchlistRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:4200")
public class PortfolioController {

    private final PortfolioAssetRepository portfolioAssetRepository;
    private final CryptoWatchlistRepository cryptoWatchlistRepository;

    public PortfolioController(PortfolioAssetRepository portfolioAssetRepository,
            CryptoWatchlistRepository cryptoWatchlistRepository) {
        this.portfolioAssetRepository = portfolioAssetRepository;
        this.cryptoWatchlistRepository = cryptoWatchlistRepository;
    }

    @GetMapping("/assets/user/{userId}")
    public List<PortfolioAsset> getAssetsByUserId(@PathVariable UUID userId) {
        return portfolioAssetRepository.findByUserId(userId);
    }

    @PostMapping("/assets")
    public PortfolioAsset createAsset(@RequestBody PortfolioAsset asset) {
        return portfolioAssetRepository.save(asset);
    }

    @GetMapping("/watchlist/user/{userId}")
    public List<CryptoWatchlist> getWatchlistByUserId(@PathVariable UUID userId) {
        return cryptoWatchlistRepository.findByUserId(userId);
    }

    @PostMapping("/watchlist")
    public CryptoWatchlist addToWatchlist(@RequestBody CryptoWatchlist item) {
        return cryptoWatchlistRepository.save(item);
    }
}
