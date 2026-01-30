package com.prisma.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "crypto_watchlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoWatchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "coin_id", nullable = false)
    private String coinId;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String name;

    @Column(name = "added_at", insertable = false, updatable = false)
    private ZonedDateTime addedAt;
}
