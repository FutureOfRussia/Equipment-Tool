$(function(){
    $('.menu a').click(getEquip); // Get equipment by ID of the room
    $('.is-brand').click(getWelcome); // Open welcome notification in the 'data' block
    $('.acc-open').on('click', openMenu); // Open item in the left menu
    $('.acc-close').on('click', closeMenu); // Close item in the left menu
    $('#data').delegate('.card-open', 'click', openCard); // Open item in the 'data' block
    $('#data').delegate('.card-close', 'click', closeCard); // Close item in the 'data' block
    $('#data').delegate('.set-form', 'click', getSetForm); // Create a form for adding new equipment
    $('#data').delegate('.del', 'click', del); // Remove equipment by ID
    $('#data').delegate('.edit', 'click', getEditForm); // Create a form for edit equipment
    $('#data').delegate('.cancel', 'click', cancelForm); // Delete 'set' or 'edit' form
});

function openMenu() { // Open item in the left menu
	$(this).parent().next().next().slideToggle(500);
	$(this).hide();
	$(this).next().show();
};

function closeMenu() { // Close item in the left menu
	$(this).parent().next().next().slideToggle(500);
	$(this).hide();
	$(this).prev().show();
};

function openCard() { // Open item in the 'data' block
	$(this).parent().next().slideToggle(500);
	$(this).hide();
	$(this).next().show();
};

function closeCard() { // Close item in the 'data' block
	$(this).parent().next().slideToggle(500);
	$(this).hide();
	$(this).prev().show();
};

function getWelcome() { // Open welcome notification in the 'data' block
	$('#data').html('<div class="notification is-primary" style="text-align: center;"><h1 class="title is-1">Welcome to the Equipment Tools!</h1><br><p class="subtitle is-4">This application works with a hierarchy of buildings and equipment that is contained in the premises.</p><p class="subtitle is-3">To start working, select the building or room in it and click on it.</p></div>');
};

function getEquip() { // Send a POST request to get a list of equipment by ID of the room
	$('#data').empty();
	var linkId = $(this).attr('id');
	var key = $(this).attr('key');
	var ids = key.split(',');
	ids.map((id) => {
    	$.post('/', {'id': id}, function (data) {
    		addBlock(data, linkId, id); // Send the received data to the block creation function
    	});
	})
};

function addBlock(data, link, id) { // From the obtained data compose the block with the table
	var roomId = id;
	var linkId = link;
	var roomName = $('#' + roomId).html();
	var block = "";

	data.map((item) => {
		var str = "<tr><td>" + item.name + "</td><td>" + item.count + "</td><td><a class='edit icon' key='"+linkId+","+item.name+","+item.count+","+roomId+"' id='"+item._id+"'><i class='fa fa-pencil'></i></a><a class='del icon' key='"+linkId+"' id='"+item._id+"'><i class='fa fa-trash'></i></a></td>";
		block = block + str;
	})

	var table = "<table class='table'><thead><tr><th><abbr title='Equipment name'>Name</abbr></th><th><abbr title='Quantify of equipment'>Quantify</abbr></th><th></th></tr></thead><tbody>"+block+"</tbody></table>";
	var fullBlock = "<div class='card'><header class='card-header'><p class='card-header-title'>"+roomName+"</p><a class='card-open card-header-icon'><span class='icon'><i class='fa fa-angle-down'></i></span></a><a class='card-close card-header-icon' style='display: none;'><span class='icon'><i class='fa fa-angle-up'></i></span></a></header><div class='card-content'><div class='content'>"+table+"</div><div class='get-set-form'><footer class='card-footer'><a id='"+roomId+"' key='"+linkId+"' class='set-form card-footer-item'><span class='icon'><i class='fa fa-plus'></i></span></a></footer></div></div></div>";
	$('#data').append(fullBlock);
};

function getSetForm() { // Create a form for adding new equipment
	var room = $(this).attr('id');
	var link = $(this).attr('key');
	$(this).parent().parent().html('<form key = "'+link+'" class="form-set" method="post" action="javascript:void(null);" onsubmit="set()"><input style="width: 50%;" class="input" type="text" name="name" value="New equipment"><input style="width: 20%;" class="input" type="number" name="count" value="1"><input type="hidden" name="room" value="'+room+'"><input style="width: 15%;" class="button is-primary" type="submit" value="Add"><button key="'+room+'" id="'+link+'" style="width: 15%" class="cancel button is-danger">Cancel</button></form>');
};

function set() { // Send a POST request to create new equipment
	var msg = $('.form-set').serialize();
	var link = $('.form-set:first').attr('key');
	$.post('/set', msg, function(data) {
		if (data) { $('#'+link)[0].click(); } // Update 'data' block
	});
};

function del() { // Send a POST request to remove equipment by ID
	var link = $(this).attr('key');
	var key = $(this).attr('id');
	$.post('/delete', {'id': key}, function(data) {
		if (data) { $('#'+link)[0].click(); } // Update 'data' block
	});
};

function getEditForm() { // Create a form for edit equipment
	var id = $(this).attr('id');
	var data = $(this).attr('key').split(',');
	var link = data[0];
	var name = data[1];
	var count = data[2];
	var room = data[3];
	$(this).parent().parent().parent().parent().parent().next().html('<form key = "'+link+'" class="form-edit" method="post" action="javascript:void(null);" onsubmit="edit()"><input style="width: 50%" class="input" type="text" name="name" value="'+name+'"><input style="width: 20%" class="input" type="number" name="count" value="'+count+'"><input type="hidden" name="id" value="'+id+'"><input style="width: 15%" class="button is-primary" type="submit" value="Save"><button key="'+room+'" id="'+link+'" style="width: 15%" class="cancel button is-danger">Cancel</button></form>');
};

function edit() { // Send a POST request to edit equipment
	var msg = $('.form-edit').serialize();
	var link = $('.form-edit:first').attr('key');
	$.post('/edit', msg, function(data) {
		if (data) { $('#'+link)[0].click(); } // Update 'data' block
	});
};

 function cancelForm() { // Delete 'set' or 'edit' form
 	var roomId = $(this).attr('key');
 	var linkId = $(this).attr('id');
 	$(this).parent().parent().html("<footer class='card-footer'><a id='"+roomId+"' key='"+linkId+"' class='set-form card-footer-item'><span class='icon'><i class='fa fa-plus'></i></span></a></footer>")
 }
 