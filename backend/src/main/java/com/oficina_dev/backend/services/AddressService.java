package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Address.AddressRemovedResponseDto;
import com.oficina_dev.backend.dtos.Address.AddressRequestDto;
import com.oficina_dev.backend.dtos.Address.AddressRequestPatchDto;
import com.oficina_dev.backend.dtos.Address.AddressResponseDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.AddressMapper;
import com.oficina_dev.backend.models.Address.Address;
import com.oficina_dev.backend.repositories.AddressRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AddressService {

    private final String addressNotFoundMessage = "Address not found";

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AddressMapper addressMapper;

    public Address findById(UUID id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(addressNotFoundMessage));
    }

    public AddressResponseDto getById(UUID id) {
        Address address = findById(id);
        return this.addressMapper.toResponse(address);
    }

    public List<AddressResponseDto> getAll() {
        List<Address> addresses = this.addressRepository.findAll();
        return addresses.stream()
                .map(this.addressMapper::toResponse)
                .toList();
    }

    public AddressResponseDto create(AddressRequestDto addressRequestDto) {
        Address address = this.addressMapper.toEntity(addressRequestDto);
        Address savedAddress = this.addressRepository.saveAndFlush(address);
        return this.addressMapper.toResponse(savedAddress);
    }

    public AddressResponseDto update(UUID id, AddressRequestDto addressRequestDto) {
        Address address = this.findById(id);
        this.addressMapper.update(address, addressRequestDto);
        Address savedAddress = this.addressRepository.saveAndFlush(address);
        return this.addressMapper.toResponse(savedAddress);
    }

    public AddressResponseDto patch(UUID id, AddressRequestPatchDto addressRequestDto) {
        Address address = this.findById(id);
        this.addressMapper.patch(address, addressRequestDto);
        Address savedAddress = this.addressRepository.saveAndFlush(address);
        return this.addressMapper.toResponse(savedAddress);
    }

    public AddressRemovedResponseDto delete(UUID id) {
        Address address = this.findById(id);
        this.addressRepository.deleteById(id);
        return this.addressMapper.toRemovedResponse(address);
    }

}
