package com.oficina_dev.backend.models.Donation;

import com.oficina_dev.backend.models.DonationItem.DonationItem;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_donations", schema = "public")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Setter
    @ManyToOne
    @JoinColumn(name = "id_giver")
    private Giver giver;

    @Setter
    @ManyToOne
    @JoinColumn(name = "id_voluntary")
    private Voluntary voluntary;

    @OneToMany(mappedBy = "donation", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DonationItem> donationItems;

    public Donation(Giver giver, Voluntary voluntary) {
        this.giver = giver;
        this.voluntary = voluntary;
        this.donationItems = new ArrayList<DonationItem>();
    }

    public void addDonationItem(DonationItem donationItem) {
        if (donationItems == null) {
            donationItems = new ArrayList<>();
        }
        donationItems.add(donationItem);
        donationItem.setDonation(this);
    }
}
