package com.prisma.repository;

import com.prisma.entity.CryptoWatchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CryptoWatchlistRepository extends JpaRepository<CryptoWatchlist, UUID> {
    List<CryptoWatchlist> findByUserId(UUID userId);
}
