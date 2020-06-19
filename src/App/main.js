const {$, anime, autosize, Cookies, Highcharts, dataLayer} = window

const donateUrl = "https://act.greenpeace.org/page/4723/donate/1?campaign=polar&ref=savethearctic_thankyou_page";
const shareUrl = "https://act.greenpeace.org/page/60861/petition/1";
const shareFBUrl = "https://act.greenpeace.org/page/60861/petition/1";
const shareLineUrl = "https://act.greenpeace.org/page/60861/petition/1";
const redirectDonateLink = "https://act.greenpeace.org/page/4723/donate/1?campaign=polar&ref=savethearctic_thankyou_page"

window.donate = () => {
	window.open(
        donateUrl,
        "_blank"
    );
}
window.share = () => {

	if (navigator.share) {
		// we can use web share!
		navigator
			.share({
				title: "阻止破壞北極 今天立即加入全球行動！",
				text: "全賴有您，守護北極的力量日益強大。我們團結一起，讓守護北極的呼聲，揚得更遠！經過三年不懈的努力、超過700萬人揭露SHELL的野心；九月底，石油公司SHELL終於止步北極！現在，讓我們進一步確保所有石油公司永不復返。",
				url: shareUrl
			})
			.then(() => console.log("Successfully shared"))
			.catch(error => console.log("Error sharing:", error));
	} else {
		
		var baseURL = "https://www.facebook.com/sharer/sharer.php";
		
		console.log('open', baseURL + "?u=" + encodeURIComponent(shareFBUrl))
		window.open(
			baseURL + "?u=" + encodeURIComponent(shareFBUrl),
			"_blank"
		);
	}
}

var pageInit = function(){
    console.log('init')
    var _ = this;
    _.$container = $('#form');

    _.$container.find('input, select').bind('change blur', function(){
        if($(this).val() !== ''){
            $(this).addClass('filled');
        }
        else{
            $(this).removeClass('filled');
        }
    });

    $('#center_sign-submit').click(function(e){
        e.preventDefault();
        $("#center_sign-form").submit();
        console.log("center_sign-form submitting")
    }).end()

    // create the year options
    let currYear = new Date().getFullYear()
    for (var i = 0; i < 80; i++) {
        
        let option = `<option value="01/01/${currYear-i}">${currYear-i}</option>`
        $("#center_yearofbirth").append(option);
        $('#en__field_supporter_NOT_TAGGED_6').append(option);
    }

    $.validator.addMethod( //override email with django email validator regex - fringe cases: "user@admin.state.in..us" or "name@website.a"
        'email',
        function(value, element){
            return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(value);
        },
        'Email 格式錯誤'
    );

    $.validator.addMethod(
        "taiwan-phone",
        function (value, element) {
            
            const phoneReg1 = new RegExp(/0\d{1,2}-\d{6,8}$/).test(value);
            const phoneReg2 = new RegExp(/0\d{1,2}\d{6,8}$/).test(value);
            const phoneReg3 = new RegExp(/((?=(09))[0-9]{10})$/).test(value);
            const phoneReg4 = new RegExp(/(886\d{1,2}\d{6,8})$/).test(value);
            const phoneReg5 = new RegExp(/(886\d{1,2}-\d{7,9})$/).test(value);
            
            // console.log(value)
            // console.log(phoneReg1)
            // console.log(phoneReg2)
            // console.log(phoneReg3)
            // console.log(phoneReg4)
            // console.log(phoneReg5)

            if ($('#center_phone').val()) {
                return (phoneReg1 || phoneReg2 || phoneReg3 || phoneReg4 || phoneReg5)
            }
            console.log('phone testing')
            return true
        },
        "電話格式不正確，請只輸入數字 0912345678 和 02-23612351")

    $.validator.addClassRules({ // connect it to a css class
        "email": {email: true},
        "taiwan-phone" : { "taiwan-phone" : true }
    });

    $("#center_sign-form").validate({
        errorPlacement: function(error, element) {
            console.log(error)
            element.parents("div.form-field:first").after( error );
        },
        submitHandler: function(form) {
            
            $('#en__field_supporter_firstName').val($('#center_name').val());
            $('#en__field_supporter_lastName').val($('#center_lastname').val());
            $('#en__field_supporter_emailAddress').val($('#center_email').val());

            if (!$('#center_phone').prop('required') && !$('#center_phone').val()) {
                $('#en__field_supporter_phoneNumber').val('0900000000');
            } else {
                $('#en__field_supporter_phoneNumber').val($('#center_phone').val());
            }
            $('#en__field_supporter_NOT_TAGGED_6').val($('#center_yearofbirth').val());
            console.log("ga datalayer pushed")
            // window.dataLayer = window.dataLayer || [];
            //
            dataLayer.push({
                'event': 'gaEvent',
                'eventCategory': 'petitions',
                'eventAction': 'signup',
                'eventLabel': '2020-savethearctic',
                'eventValue': undefined
            });

            // dataLayer.push({
            //     'event': 'fbqEvent',
            //     'contentName': '2020-savethearctic',
            //     'contentCategory': 'Petition Signup'
            // });

            $("form.en__component--page").submit();
        },
        invalidHandler: function(event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (errors) {
                // console.log(errors)
                var message = errors == 1
                    ? 'You missed 1 field. It has been highlighted'
                    : 'You missed ' + errors + ' fields. They have been highlighted';
                $("div.error").show();
            } else {
                $("div.error").hide();
            }
        }
    });
}

const resolveEnPagePetitionStatus = () => {
	let status = "FRESH";
	// console.log(window);
	if (window.pageJson.pageNumber === 2) {
		status = "SUCC"; // succ page
	} else {
		status = "FRESH"; // start page
	}

	return status;
};

$(function(){

    const EN_PAGE_STATUS = resolveEnPagePetitionStatus()
	console.log("EN_PAGE_STATUS", EN_PAGE_STATUS)
	if (EN_PAGE_STATUS==="FRESH") {
	
        pageInit();
        $("#page-2").hide();

	} else if (EN_PAGE_STATUS==="SUCC") {
        
        $('#page-1').hide();
        // $('#page-2').show();
        window.location.href = redirectDonateLink;
        console.log("go to thank you page")

	}
})
