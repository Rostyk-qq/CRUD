<?php 

class SqlWork {
    private $server = 'localhost'; 
    private $username = 'root';
    private $password = '';
    private $db_name = 'users_store_db'; 

    private $connection; 

    public function __construct(){
        $this->connection = $this->connectDb(); 
        if(!empty($this->connection)){
            $this->selectDb();
        }
    }

    public function connectDb(){
        $conn = new mysqli($this->server, $this->username, $this->password, $this->db_name);
        return $conn;
    }
    public function selectDb(){
        mysqli_select_db($this->connection, $this->db_name); 
    }

    public function addUser($user){
        extract($user);
        $add = $this->connection->prepare("INSERT INTO `users` (`firstname`, `secondname`, `role`, `status`) VALUES (?, ?, ?, ?)");
        $add->bind_param('ssss', $firstname, $secondname, $role, $status);
    
        if ($add->execute() !== TRUE) {
            http_response_code(500);
            echo json_encode(['status' => false, 'error' => ['code' => 101, 'message' => 'SQL: Cannot add user']]);
            die();
        }   
        $add->close();
    }

    public function updateUser($user){
        extract($user);
        $update = $this->connection->prepare("UPDATE `users` SET firstname=?, secondname=?, role=?, status=? WHERE id=?");
        $update->bind_param("ssssi", $firstname, $secondname, $role, $status, $id);
    
        if ($update->execute() !== TRUE) {
            http_response_code(500);
            echo json_encode(['status' => false, 'error' => ['code' => 102, 'message' => 'SQL: Cannot update user']]);
            die();
        }
        $update->close();
    }

    public function getUser($id){
        if(empty($id)){
            $sql = "SELECT id FROM users ORDER BY id DESC LIMIT 1";

            $result = $this->connection->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $lastId = $row['id'];
                $id = $lastId;
            }
        }
        
        $selectUsersForGetUser = $this->connection->prepare("SELECT * FROM `users` WHERE id = ?");
        $selectUsersForGetUser->bind_param("i", $id);

        if ($selectUsersForGetUser->execute()) {
            $resultForGetUser = $selectUsersForGetUser->get_result();
            $userForGetUser = $resultForGetUser->fetch_assoc();
            $selectUsersForGetUser->close();
            
            if(empty($userForGetUser)){
                return json_encode(['status' => false, 'error' => ['code' => 200, 'message' => 'This user do not exists!']]);
            }
            else{
                return json_encode(['status' => true, 'error' => null, 'user' => $userForGetUser]);
            }
        } 
        else {
            http_response_code(500);
            return json_encode(['status' => false, 'error' => ['code' => 103, 'message' => 'Sql: This user do not exists!']]);
        }
    }


    public function deleteUser($id){
        $deleteUser = $this->connection->prepare("DELETE from users where id = ?");
        $deleteUser->bind_param('i', $id);
        
        if($deleteUser->execute() !== TRUE){
            http_response_code(500);
            return json_encode(['status' => false, 'error' => ['code' => 104, 'message' => 'SQL: user wasn`t exists']]);
        }
        return json_encode(['status' => true, 'error' => null]);
    }


    public function changeAllUsers($users){
        $checkUsers = $this->checkSelectedUsers($users);
        if($checkUsers){
            return json_encode(['status' => false, 'error' => ['code' => 200, 'message' => 'This user or users do not exists!']]);
        }

        $update = $this->connection->prepare('UPDATE users SET status = ? WHERE id = ?');
        foreach ($users as $item) {
            $id = (int)$item['id'];
            $update->bind_param('si', $item['status'], $id);
    
            if (!$update->execute()) {
                http_response_code(500);
                return json_encode(['status' => false, 'error' => ['code' => 105, 'message' => 'SQL: cannot update status!']]);
            }
        }
        $update->close();
        return json_encode(['status' => true, 'error' => null]);
    }


    public function deleteAllUsers($users){
        $delete = $this->connection->prepare('DELETE FROM users WHERE id = ?');
        foreach ($users as $item) {
            $id = (int)$item['id'];
            $delete->bind_param('i', $id);
    
            if (!$delete->execute()) {
                http_response_code(500);
                return json_encode(['status' => false, 'error' => ['code' => 106, 'message' => 'SQL: cannot delete user!']]);
            }
        }
        $delete->close();
        return json_encode(['status' => true, 'error' => null]);
    }


    public function getAllUsers($param = null){
        $getAll = $this->connection->prepare('SELECT * FROM users'); 
        if($getAll->execute() === TRUE){
            $users = [];
            $res = $getAll->get_result(); 
            while($row = $res->fetch_assoc()){
                $users[] = $row;
            }
            $getAll->close(); 
            
            if(empty($param)){
                return json_encode(['status' => true, 'error' => null, 'users' => $users]);
            }
            else{
                return $users;
            }
        }
        else{
            http_response_code(500);
            return json_encode(['status' => false, 'error' => ['code' => 107, 'message' => 'SQL: cannot get users!']]);
        }
    }

    public function checkSelectedUsers($data){
        $select = $this->connection->prepare('SELECT * FROM users WHERE id = ?');
        
        $foundNull = false;
    
        foreach ($data as $item) {
            $id = (int)$item['id'];
            $select->bind_param('i', $id);

            if (!$select->execute()) {
                http_response_code(500);
                $select->close();
                die();
            }
            
            $res = $select->get_result();
            if ($res->num_rows === 0) {
                $foundNull = true;
                break;
            }
        }
        $select->close();
    
        if ($foundNull) {
            return true; 
        }
    }
}   

$sqlWork = new SqlWork();