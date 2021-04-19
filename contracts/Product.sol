pragma solidity ^0.5.0;

contract Product{
	address public supplier;
	address public buyer;
	string public product = "";
	enum ProductState{started,created,pending,permissioned,delayed,ontime,received,paymentpending,paid,ended}
	ProductState public state = ProductState.started;
	uint public quantity;
	uint public time;
	uint public price;
	uint public time1;
	uint public time2;
	uint public time3;
	uint public hour;
	uint public min;
	string public message = "Contract Started";
	uint public delay;
	uint public bill = 0;
	uint public flag = 0;
	string public lat1 = "0";
	string public long1 = "0";
	string public lat2 = "0";
	string public long2 = "0";
	string public lat3 = "0";
	string public long3 = "0";
	uint public k=0;

	constructor() public{
		supplier = msg.sender;
	}
	
	modifier isSupplier() {
    if (msg.sender != supplier) {
      revert();
    }
    _;
  	}

  	modifier isState(ProductState a) {
		if (a != state) {
		revert();
		}
		_;
	}

	modifier isBuyer() {
		if (msg.sender != buyer) {
		revert();
		}
		_;
	}

	modifier is_k1() {
		if (k != 1) {
		revert();
		}
		_;
	}

	modifier is_k2() {
		if (k != 2) {
		revert();
		}
		_;
	}

	modifier is_k3() {
		if (k != 3) {
		revert();
		}
		_;
	}

	event ProductCreated(address buyer,string product,uint quantity,uint time,uint price,uint time1,uint time2,uint time3);
  	
  	function createProduct(string memory  b,uint c,uint d,uint e,uint f,uint g,uint h,uint i,uint j) public 
		isSupplier() {
			buyer = 0x1D46f71333B857035c325221312aca03d382D379;
			product = b;
			quantity = c;
			time = d;
			price = e;
			time1 = f;
			time2 = g;
			time3 = h;
			hour = i;
			min = j;
			state = ProductState.created;
			message = "Product was created.";
			emit ProductCreated(buyer,product,quantity,time,price,time1,time2,time3);
		}

	function askPermission() public
		isSupplier() isState(ProductState.created) {
			state = ProductState.pending;
			message = "Permission was requested by supplier.";
		}

	function grantPermission() public
		isBuyer() isState(ProductState.pending) {
			state = ProductState.permissioned;
			message = "Permission granted by buyer.";
		}

	function IoT_1(uint t1) public
		isSupplier() is_k1() isState(ProductState.permissioned) {
			
			state = ProductState.delayed;
			if(time <= t1)
			{
				message = "Shipment was delayed to reach buyer";
				delay =3;
				flag = 1;
			}
			else if(time3 <= t1)
			{
				message = "Truck was delayed to reach first check point by 2 days";
				delay = 2; 
			}
			else if(time2 <= t1)
			{
				message = "Truck was delayed to reach first check point by 1 day";
				delay = 1; 
			}
			else
			{
				message = "Truck reached the first check point with no delay";
				state = ProductState.ontime;
				delay = 0;
			}
		}

	function loc_1(string memory a,string memory b) public
		isSupplier() {
		k=1;
		lat1 = a;
		long1 = b;
	}

	function IoT_2(uint t2) public
		isSupplier() is_k2() {
			state = ProductState.delayed;
			if(time <= t2)
			{
				message = "Shipment was delayed to reach buyer";
				if(flag == 0)
				{
					delay =2;
					flag = 1;
				}

			}
			else if(time3 <= t2)
			{
				message = "Truck was delayed to reach second check point by 1 day";
				delay = 1;
			}
			else
			{
				message = "Truck reached the second check point with no delay";
				state = ProductState.ontime;
			}
		}

	function loc_2(string memory a,string memory b) public
		isSupplier() {
		k=2;
		lat2 = a;
		long2 = b;
	}

	function IoT_3(uint t3) public
		isSupplier() is_k3() {
			
			state = ProductState.delayed;
			if(time < t3)
			{
				message = "Shipment was delayed to reach buyer";
				if(flag == 0)
				{
					delay = 1;
					flag = 1;
				}
			}
			else
			{
				message = "Truck reached the third check point on time";
				state = ProductState.ontime;
			}
		}

	function loc_3(string memory a,string memory b) public
		isSupplier() {
		k=3;
		lat3 = a;
		long3 = b;
	}

	function acknowledgeShipment() public
		isBuyer() {
			state = ProductState.received;
			message = "Shipment received.";
		}
				
	function submitBill() public
		isSupplier() isState(ProductState.received) {
			bill = price - ((delay*price)/10);
			state = ProductState.paymentpending;
			message = "Bill was submitted.Please make the payment.";
		}

	function makePayment() public payable
		isBuyer() isState(ProductState.paymentpending) {
			state = ProductState.paid;
			message = "Payment done.";
		}

	function acknowledgePayment() public
		isSupplier() isState(ProductState.paid) {
			state = ProductState.ended;
			message = "Payment received.Contract done.";
		}
}