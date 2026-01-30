package com.prisma.controller;

import com.prisma.entity.KpiMetric;
import com.prisma.repository.KpiMetricRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi")
@CrossOrigin(origins = "http://localhost:4200")
public class KpiController {

    private final KpiMetricRepository kpiReposity;

    public KpiController(KpiMetricRepository kpiReposity) {
        this.kpiReposity = kpiReposity;
    }

    @GetMapping("/user/{userId}")
    public List<KpiMetric> getMetricsByUserId(@PathVariable UUID userId) {
        return kpiReposity.findByUserId(userId);
    }

    @PostMapping
    public KpiMetric createMetric(@RequestBody KpiMetric metric) {
        return kpiReposity.save(metric);
    }
}
