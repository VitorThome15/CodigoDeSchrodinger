package com.oficina_dev.backend.models.Transfer;

import com.oficina_dev.backend.models.Receiver.Receiver;
import com.oficina_dev.backend.models.TransferItem.TransferItem;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_transfers", schema = "public")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "id_receiver")
    private Receiver receiver;

    @ManyToOne
    @JoinColumn(name = "id_voluntary")
    private Voluntary voluntary;

    @OneToMany(mappedBy = "transfer", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<TransferItem> transferItems;

    public Transfer(Receiver receiver, Voluntary voluntary) {
        this.receiver = receiver;
        this.voluntary = voluntary;
        this.transferItems = new ArrayList<>();
    }

    public void addTransferDonationItem(TransferItem item) {
        item.setTransfer(this);
        this.transferItems.add(item);
    }
}
