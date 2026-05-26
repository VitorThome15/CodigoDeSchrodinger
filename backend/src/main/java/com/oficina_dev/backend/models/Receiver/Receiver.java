package com.oficina_dev.backend.models.Receiver;

import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.ReceiverLimit.ReceiverLimit;
import com.oficina_dev.backend.models.Transfer.Transfer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_receivers", schema = "public")
public class Receiver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nif", length = 100, nullable = false, unique = true)
    private String nif;

    @Column(name = "is_fit", nullable = false)
    private Boolean isFit;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Setter
    @OneToOne
    @JoinColumn(name = "id_person", referencedColumnName = "id")
    private Person person;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ReceiverLimit> receiverLimits;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Transfer> transfers;

    public Receiver(String nif, Boolean isFit, Person person) {
        setNif(nif);
        this.isFit = isFit;
        this.person = person;
    }


    public ReceiverLimit getAtualReceiverLimit() {
        if (this.receiverLimits == null || this.receiverLimits.isEmpty()) {
            return null;
        }
        return this.receiverLimits.get(receiverLimits.size() - 1); } // Mudado para retornar o último elemento da lista 06/10    }

    public void setNif(String nif) {
        //TODO: IMPLEMENT NIF VALIDATION HERE
        if (nif == null || nif.isEmpty()) {
            throw new IllegalArgumentException("NIF cannot be null or empty");
        }
        this.nif = nif;
    }

    public void setFit(Boolean fit) {
        this.isFit = fit;
    }

}