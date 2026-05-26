package com.oficina_dev.backend.models.Item;


import com.oficina_dev.backend.models.Category.Category;
import com.oficina_dev.backend.models.DonationItem.DonationItem;
import com.oficina_dev.backend.models.Size.Size;
import com.oficina_dev.backend.models.TransferItem.TransferItem;
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
@Table(name = "tb_items", schema = "public")
public class Item {

    @Id
    @Setter
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "sex", length = 1, nullable = false)
    private Character sex;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "id_category", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "id_size", nullable = false)
    private Size size;

    @OneToMany(mappedBy = "item", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DonationItem> donationItems;

    @OneToMany(mappedBy = "item", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<TransferItem> transferItems;

    public Item(String name, Integer quantity,Character sex, Category category, Size size) {
        this.setName(name);
        this.setSex(sex);
        this.setQuantity(quantity);
        this.setCategory(category);
        this.setSize(size);
    }

    public void setQuantity(Integer quantity) {
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        this.quantity = quantity;
    }

    public void setSex(Character sex) {
        if (sex == null) {
            throw new IllegalArgumentException("O sexo do item não pode ser vazio.");
        }
        
        // Converte o caractere para minúsculo automaticamente ('M' vira 'm')
        Character normalizedSex = Character.toLowerCase(sex); 
        
        if (normalizedSex == 'm' || normalizedSex == 'f' || normalizedSex == 'u') {
            this.sex = normalizedSex;
        } else {
            throw new IllegalArgumentException("O sexo do item deve ser 'm', 'f' ou 'u'");
        }
    }

    public void setName(String name) {
        this.name = name.toLowerCase().trim();
    }


    public void setCategory(Category category) {
        this.category = category;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public void incrementQuantity(Integer quantity) {
        if(quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        this.quantity += quantity;
    }

    public void decrementQuantity(Integer quantity) {
        if(quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        this.quantity -= quantity;
    }

}
