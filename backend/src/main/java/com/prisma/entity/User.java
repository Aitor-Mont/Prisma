package com.prisma.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private ZonedDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<KpiMetric> kpiMetrics;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PortfolioAsset> portfolioAssets;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<CryptoWatchlist> cryptoWatchlist;
}
