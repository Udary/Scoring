$(document).ready(function () {
    const myTimeout = setTimeout(bindUp, 1000);

    function bindUp() {

        // Add minus icon for collapse element which is open by default
        $(".collapse.show").each(function () {
            $(this).prev(".historyRow").find(".fa").addClass("fa-minus").removeClass("fa-plus");
        });

        // Toggle plus minus icon on show hide of collapse element
        $(".collapse").on('show.bs.collapse', function () {
            $(this).prev(".historyRow").find(".fa").removeClass("fa-plus").addClass("fa-minus");
        }).on('hide.bs.collapse', function () {
            $(this).prev(".historyRow").find(".fa").removeClass("fa-minus").addClass("fa-plus");
        });
        clearTimeout(myTimeout);
    }
});

