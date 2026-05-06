package edu.demon;
import edu.demon.Fruit;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FruitRepository  extends JpaRepository<Fruit,Long>{

}