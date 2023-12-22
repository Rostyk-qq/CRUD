<?php       
  require_once('./sql.php'); 
  $sql = new SqlWork();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Users List</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
  integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="clean-switch-master/clean-switch.css">
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
<div class="custom-font" id="page">
  <div class="container back d-flex flex-column my-5 py-5 border rounded" id="page__table-container">
    <b>Users</b>

    <div class="col-3 d-flex mb-2" id="container_header">
      <div class="dropdown" id="dropdown_header">
        <button class="btn border dropdown-toggle custom-font button_text-show d-flex justify-content-around align-items-center" 
        type="button" data-bs-toggle="dropdown" aria-expanded="true">
          --Select Please--
        </button>
        <ul class="dropdown-menu custom-font">
          <li class="px-1"><button class="dropdown-item rounded" selected type="button">--Select Please--</button></li>
          <li class="px-1"><button class="dropdown-item rounded" value="active" type="button">Set Active</button></li>
          <li class="px-1"><button class="dropdown-item rounded" value="non-active" type="button">Set not Active</button></li>
          <li class="px-1"><button class="dropdown-item rounded" value="delete" type="button">Delete</button></li>
        </ul>
      </div>
    </div>

    <table id="container__table" class="table table-bordered my-1 p-0 mx-0">
      <thead>
      <tr>
        <th class="col-1">
          <input class="form-check-input shadow-none fs-6" type="checkbox" id="main_check-box">
        </th>
        <th class="col-2">Name</th>
        <th class="col-2">Role</th>
        <th class="col-2">Status</th>
        <th class="col-2">Options</th>
      </tr>
      </thead>
      <tbody id="users_list">
          <?php 
            $users = $sql->getAllUsers('StartTable'); 
            $role = [1 => "Admin", 2 => "User"];

            if($users){
              foreach($users as $value){
          ?>
              <tr data-user-id='<?php echo $value["id"]; ?>'>
                <td class='checkbox'>
                    <input class='form-check-input shadow-none fs-6 table_checkbox-child' type='checkbox' value='<?php echo $value["id"]; ?>'>
                </td>
                <td><span class='firstname' ><?php echo $value["firstname"]; ?></span>  <span class='secondname' ><?php echo $value["secondname"]; ?></span></td>
                <td class='role' value='<?php echo $value["role"]; ?>' ><?php echo $role[intval($value["role"])]; ?></td>
                <td class='position-relative p-0'>
                    <span class='status_circle  <?php echo intval($value["status"]) === 1 ? 'active' : '' ?>'></span>
                </td>
                <td class='position-relative p-0 border-start-0'>
                    <div class='position-absolute d-flex top-50 start-50 translate-middle'>
                        <button data-btn-id='<?php echo $value["id"]; ?>' class='px-1 rounded-start
                        border-end-0 border-1 border bg-white border-black-50 fw-bolder text-black-50 p-0 table__btn-edit' id='table__btn-edit' >
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button data-rmBtn-id='<?php echo $value["id"]; ?>' class='px-1 rounded-end border-1 border border-black-50 bg-white text-black-50 p-0 
                        table__btn-remove' type='button' class='btn btn-primary'>
                            <i class='fa fa-trash'></i>
                        </button>
                    </div>
                </td>
              </tr>
            <?php 
                };
              }
            ?>
      </tbody>
    </table>

    <div class="col-3 d-flex flex-basis mt-2" id="container_footer">
        <div class="dropdown" id="dropdown_footer">
          <button class="btn border dropdown-toggle custom-font button_text-show d-flex justify-content-around align-items-center" 
          type="button" data-bs-toggle="dropdown" aria-expanded="true">
            --Select Please--
          </button>
          <ul class="dropdown-menu custom-font">
            <li class="px-1"><button class="dropdown-item rounded" selected type="button">--Select Please--</button></li>
            <li class="px-1"><button class="dropdown-item rounded" value="active" type="button">Set Active</button></li>
            <li class="px-1"><button class="dropdown-item rounded" value="non-active" type="button">Set not Active</button></li>
            <li class="px-1"><button class="dropdown-item rounded" value="delete" type="button">Delete</button></li>
          </ul>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal display-block fade" id="staticBackdrop">
      <div class="modal-dialog" id="modal-dialog">
        <div class="modal-content" id="modal-content">
          <div class="modal-header" id="modal-header">
            <h1 class="modal-title fs-5"></h1>
            <button type="button" class="btn-close button-close" id="header_button-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <!-- form -->
          <form id="form">
            <div id="modal-body" class="modal-body d-flex flex-column fs-6">
                <input type="hidden" value="" name="id" id="user-id">
                <div class="my-2">
                  <label for="modal_first-name">First name</label>
                  <input name="firstname" class="border py-1 px-2 custom-outline-none w-100" id="modal_first-name" type="text">
                  <span class="fs-6 text-danger" id="not-fill-f" ></span>
                </div>
                <div class="my-2">
                  <label for="modal_last-name">Second name</label>
                  <input name="secondname" class="border py-1 px-2 w-100" id="modal_last-name" type="text">
                  <span class="fs-6 text-danger" id="not-fill-s"></span>
                </div>
                <div class="my-2">
                  <label class="cl-switch cl-switch-large cl-switch-white d-flex flex-column">
                    <label for="modal_switch">Status</label>
                    <input name="status" data-toggle="toggle" class="update_modal_switch" id="modal_switch" type="checkbox">
                    <span class="switcher"></span>
                  </label>
                </div>
                <div class="my-3">
                  <label for="modal_select">Role</label>
                  <div id="modal_select" class="dropdown update-modal_select">
                    <select name='role' id="form-select" class="form-select" aria-label="Default select example"></select>
                  </div>
                  <span class="fs-6 text-danger" id="not-chose" ></span>
                </div>
            </div>
            <div class="modal-footer">
              <button id="footer_button-close"  type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="footer_button-add" type="submit" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <div class="modal display-block fade" id="modalConfirm">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Confirmation</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="formConfirm">
            <div class="modal-body">
                <span class="fs-6" id="userFullName" ></span>
            </div>
            <div class="modal-footer">
              <button type="button" id="close_modal-confirm" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-danger">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalWarningUserNotChose">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Warning</h1>
          </div>
          <form>
            <div class="modal-body">
              <span id="warning_title" class="fs-6"></span>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>

<script src="./script.js" defer></script>
</body>
</html>
