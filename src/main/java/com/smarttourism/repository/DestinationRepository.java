package com.smarttourism.repository;

import com.smarttourism.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByCategory(String category);
}
