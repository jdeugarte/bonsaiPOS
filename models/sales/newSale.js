var fs = require('fs');

(function ($) {
  // Leer
  fs.readFile('bd/products.json', function (err, products) {
    if (err) throw err;
    var myObject = eval('(' + products + ')');
    var total = 0;

    $('#form1').on('submit', function (event) {
      event.preventDefault();
      var data_table = $("#tblDatos");
      var code_product = $("#code_product").val();
      var resp = false;

      for (var cont = 0; cont < myObject.length; cont++) {
        if (code_product == myObject[cont].code) {
          if (myObject[cont].amount <= 0) alert("Producto Agotado");

          data_table.append("<tr><td>" + myObject[cont].code + "</td><td>" + myObject[cont].name + "</td><td>" + 1 + "</td><td>" + myObject[cont].price + "</td></tr>");
          myObject[cont].amount = myObject[cont].amount - 1;
          total = total + parseInt(myObject[cont].price);
          $("#total").text(total);
          resp = true;
          break;
        }
      }
      if (resp == false) alert("Producto Inexistente");

    });

    $("#btn_confirm").click(function () {
      var products_number = $("#tblDatos tr").length;

      if (products_number > 1) {

        fs.readFile('bd/sales.json', function (err, sales) {
          if (err) throw err;

          var mySales = eval('(' + sales + ')');
          var date = new Date();
          var size = mySales.length;

          mySales.push({ "id": size + 1, "date": date, "total": total });
          fs.writeFileSync("bd/sales.json", JSON.stringify(mySales), 'utf8');

        });

        fs.writeFileSync("bd/products.json", JSON.stringify(myObject), 'utf8');
        alert("Exito en la venta");
        location.reload();
      } else {
        alert("Error, no existen productos en la linea de venta.");
      };
    });

  });

})(jQuery);
