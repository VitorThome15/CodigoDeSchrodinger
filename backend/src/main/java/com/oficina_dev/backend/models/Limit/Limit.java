package com.oficina_dev.backend.models.Limit;


import com.oficina_dev.backend.models.ReceiverLimit.ReceiverLimit;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_limit", schema = "public")
public class Limit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "limit_quantity", nullable = false)
    private Integer limitQuantity;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @OneToMany(mappedBy = "limit", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ReceiverLimit> receiverLimitList;

    public Limit(Integer month, Integer year, Integer limitQuantity) {
        this.setMonth(month);
        this.setYear(year);
        this.setLimitQuantity(limitQuantity);
    }

    public void setMonth(Integer month) {
        if(month == null || month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        this.month = month;
    }

    public void setYear(Integer year) {
        if(year == null || year < 1900 || year > 2100) {
            throw new IllegalArgumentException("Year must be a valid year between 1900 and 2100");
        }
        this.year = year;
    }

    public void setLimitQuantity(Integer limitQuantity) {
        if(limitQuantity == null || limitQuantity < 0) {
            throw new IllegalArgumentException("Limit quantity must be a non-negative integer");
        }
        this.limitQuantity = limitQuantity;
    }
}
