App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (window.ethereum) {
      console.log(Web3);
      web3 = new Web3(window.ethereum);
      try { 
        window.ethereum.enable().then(function()
          {

          });
      } catch(e) {
    }
    }
    if (window.ethereum) {
      console.log(Web3);
      web3 = new Web3(window.ethereum);
      try { 
        window.eth_requestAccounts();
      } catch(e) {
    }
    }
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Product.json", function(product) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Product = TruffleContract(product);
      // Connect provider to interact with contract
      App.contracts.Product.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  render: function() {
    var productInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + App.account);
      }
    });
    
      
    navigator.geolocation.getCurrentPosition(function(position){
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
          });
    var current = new Date();
    console.log(current.getHours());
    console.log(current.getMinutes());     
                   
    // Load contract data
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      //console.log(App.account);
        productInstance.product().then(function(good){
          $("#product").html("Your Product: "+good);
        });
        //$("#product").html("Your product: " + productInstance.product());
        
        //$("#message").html("Message: " + productInstance.message());
        productInstance.message().then(function(msg){
          $("#message").html("Message: "+msg);
        });
        
        productInstance.bill().then(function(amount){
          $("#bill").html("Bill: "+amount);
        });
        
        productInstance.state().then(function(ste){
          $("#state").html("Product State: "+ste);
        });
        //$("#state").html("Product State: " + productInstance.state());

        productInstance.lat1().then(function(lat1){
          $("#lat1").html("Checkpoint1 latitude: "+lat1);
        });
        
        productInstance.long1().then(function(long1){
          $("#long1").html("Checkpoint1 longitude: "+long1);
        });
      
        productInstance.lat2().then(function(lat2){
          $("#lat2").html("Checkpoint2 latitude: "+lat2);
        });
        
        productInstance.long2().then(function(long2){
          $("#long2").html("Checkpoint2 longitude: "+long2);
        });
      
        productInstance.lat3().then(function(lat3){
          $("#lat3").html("Checkpoint3 latitude: "+lat3);
        });
        
        productInstance.long3().then(function(long3){
          $("#long3").html("Checkpoint3 longitude: "+long3);
        });
        
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  
  

  createProduct: function() {

    var current = new Date();
    var h = current.getHours();
    var m = current.getMinutes();
    
    var productInstance;
    //console.log(App.account);
    /var buyerID = Web3.utils.utf8ToHex($('#buyerID').val());/
    var pname   = $('#pname').val();
    var quantity = parseInt($('#quantity').val());
    var time    = parseInt($('#endTime').val());
    var price   = parseInt($('#price').val());
    var time1   = parseInt($('#time1').val());
    var time2   = parseInt($('#time2').val());
    var time3   = parseInt($('#time3').val());
    
    if(pname == "")
    {
        alert("Product name is missing");
        return false;
    }
    
    if(time == "")
    {
        alert("Provide time to reach seller to buyer");
        return false;
    }
    if(price == "")
    {
        alert("Provide appropriate Price");
        return false;
    }
    if(time1 == "" || time1 > time)
    {
        
        if(time1 == "")
        {
                alert("Provide time to reach the first checkpoint");
                
        }
        if(time1 > time)
        {
                alert("Time to reach the first checkpoint should be less than total time to reach the buyer");
        }
        return false;
    }
    if(time2 == "" || time2 > time || time2 < time1 )
    {
        
        if(time2 == "")
        {
                alert("Provide time to reach the second checkpoint");
        }
        if(time2>time)
        {
                alert("Time to reach the second checkpoint should be less than total time to reach the buyer");
                
        }
        if(time2<time1)
        {
                alert("Time to reach the second checkpoint must be greater than the time that reached FIRST checkpoint");
        }
        return false;
    }
    if(time3 == "" || time3 > time || time2 > time3 || time1 > time3)
    {
        if(time3 == "")
        {
                alert("Provide time to reach the third checkpoint");
                
        }
        if(time3>time)
        {
                alert("Time to reach third checkpoint to be less than time to reach buyer");
        }
        if(time2>time3)
        {
                alert("Time to reach the third checkpoint must be greater than the time that reached SECOND checkpoint");
        }
        if(time1 > time3)
        {
                alert("Time to reach the second checkpoint must be greater than the time that reached FIRST checkpoint");
        }
        
        return false;
    }
    
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.createProduct(pname,quantity,time,price,time1,time2,time3,h,m,{ from: App.account });
      }).then(function(result){
      
      $('#loader').hide();
      $('#content').show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  askPermission: function() {
    var productInstance;
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.askPermission({ from: App.account });
      }).then(function(result){
      $('#loader').hide();
      $('#content').show();
      }).catch(function(error) {
      console.warn(error);
    });
  },

  grantPermission: function() {
    var productInstance;
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.grantPermission({ from: App.account });
      }).then(function(result){
      $('#loader').hide();
      $('#content').show();
      }).catch(function(error) {
      console.warn(error);
    });
  },

  IoT_1: function() {
    var productInstance;
    var time1 = 0;
    var h = 0;
    var m = 0;
        
    App.contracts.Product.deployed().then(function(instance) {
        productInstance = instance;
          productInstance.hour().then(function(x){
          h=x;
          return h;
          }).then(function(h){
          productInstance.min().then(function(y)
          {
            m=y;
            var current = new Date();
            var h1 = current.getHours();
            var m1 = current.getMinutes();
      
            time1 = ((h1-h)*60)+(m1-m);
            productInstance.IoT_1(time1,{ from: App.account });
            
          })
          });
        $('#loader').hide();
        $('#content').show();
      
      }).catch(function(error) {
      console.warn(error);
    });
  },

  loc_1: function() {
    App.contracts.Product.deployed().then(function(instance) {
        productInstance = instance;
        navigator.geolocation.getCurrentPosition(function(position){
            var x1 = position.coords.latitude;
            var x2 =x1.toString();
            var y1 = position.coords.longitude;
            var y2 =y1.toString();
            productInstance.loc_1(x2,y2,{ from: App.account });
            });
        $('#loader').hide();
        $('#content').show();
      
      }).catch(function(error) {
      console.warn(error);
    });
  },

  IoT_2: function() {
    var productInstance;
    var time2 = 0;
    var h = 0;
    var m = 0;
        
    App.contracts.Product.deployed().then(function(instance) {
        productInstance = instance;
          productInstance.hour().then(function(x){
          h=x;
          return h;
          }).then(function(h){
          productInstance.min().then(function(y)
          {
            m=y;
            var current = new Date();
            var h1 = current.getHours();
            var m1 = current.getMinutes();
      
            time2 = ((h1-h)*60)+(m1-m);
            productInstance.IoT_2(time2,{ from: App.account });
            
          })
          });
        $('#loader').hide();
        $('#content').show();
      
      }).catch(function(error) {
      console.warn(error);
    });
  },

loc_2: function() {
    App.contracts.Product.deployed().then(function(instance) {
        productInstance = instance;
        navigator.geolocation.getCurrentPosition(function(position){
            var x1 = position.coords.latitude;
            var x2 =x1.toString();
            var y1 = position.coords.longitude;
            var y2 =y1.toString();
            productInstance.loc_2(x2,y2,{ from: App.account });
            });
        $('#loader').hide();
        $('#content').show();
      
      }).catch(function(error) {
      console.warn(error);
    });
  },

  IoT_3: function() {
    var productInstance;
    var time3 = 0;
    var h = 0;
    var m = 0;
        
    App.contracts.Product.deployed().then(function(instance) {
        productInstance = instance;
          productInstance.hour().then(function(x){
          h=x;
          return h;
          }).then(function(h){
          productInstance.min().then(function(y)
          {
            m=y;
            var current = new Date();
            var h1 = current.getHours();
            var m1 = current.getMinutes();
      
            time3 = ((h1-h)*60)+(m1-m);
            productInstance.IoT_3(time3,{ from: App.account });
            
          })
          });
        $('#loader').hide();
        $('#content').show();
      
      }).catch(function(error) {
      console.warn(error);
    });
  },

loc_3: function() {
    App.contracts.Product.deployed().then(function(instance) {
        productInstance = instance;
        navigator.geolocation.getCurrentPosition(function(position){
            var x1 = position.coords.latitude;
            var x2 =x1.toString();
            var y1 = position.coords.longitude;
            var y2 =y1.toString();
            productInstance.loc_3(x2,y2,{ from: App.account });
            });
        $('#loader').hide();
        $('#content').show();
      
      }).catch(function(error) {
      console.warn(error);
    });
  },

  acknowledgeShipment: function() {
    var productInstance;
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.acknowledgeShipment({ from: App.account });
      }).then(function(result){
      $('#loader').hide();
      $('#content').show();
      }).catch(function(error) {
      console.warn(error);
    });
  },  

  submitBill: function() {
    var productInstance;
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.submitBill({ from: App.account });
      }).then(function(result){
      $('#loader').hide();
      $('#content').show();
      }).catch(function(error) {
      console.warn(error);
    });
  },

  makePayment: function() {
    var productInstance;
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.makePayment({ from: App.account });
      }).then(function(result){
      $('#loader').hide();
      $('#content').show();
      }).catch(function(error) {
      console.warn(error);
    });
  },

  acknowledgePayment: function() {
    var productInstance;
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.acknowledgePayment({ from: App.account });
      }).then(function(result){
      $('#loader').hide();
      $('#content').show();
      }).catch(function(error) {
      console.warn(error);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});