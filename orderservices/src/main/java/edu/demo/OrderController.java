package edu.demo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
	RestTemplate restTemplate;
	@GetMapping("/{id}")
	public String getOrder(@PathVariable int id) {
		String user=restTemplate.getForObject("http://localhost:9993 /users/"+id, String.class);
		return "Order ID:"+id+"placed by"+user;
	}
}
