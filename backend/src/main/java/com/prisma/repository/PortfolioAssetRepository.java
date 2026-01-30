package com.prisma.repository;

import com.prisma.entity.PortfolioAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PortfolioAssetRepository extends JpaRepository<PortfolioAsset, UUID> {
    List<PortfolioAsset> findByUserId(UUID userId);
}
