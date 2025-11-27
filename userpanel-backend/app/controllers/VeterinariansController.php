<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class VeterinariansController extends Controller
{
    protected $db;

    public function __construct()
    {
        parent::__construct();

        // ✅ Try to initialize LavaLust database
        $this->db = $this->call->database();

        // 🔹 Fallback: try alternative paths if the first call fails
        if (!$this->db) {
            $possiblePaths = [
                __DIR__ . '/../../scheme/database/Database.php',
                __DIR__ . '/../../core/Database.php',
                __DIR__ . '/../../system/core/Database.php'
            ];

            foreach ($possiblePaths as $path) {
                if (file_exists($path)) {
                    require_once $path;
                    $this->db = new Database();
                    break;
                }
            }

            // ⚠️ Still not found — throw clear exception
            if (!$this->db) {
                throw new Exception("⚠️ Database core file not found in any known path.");
            }
        }
    }

   public function index()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            @session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            header('Location: ' . site_url('login'));
            exit;
        }

        // ✅ Fetch all veterinarians from DB
        $data['veterinarians'] = $this->db->table('veterinarians')->get_all();

        // Check if this is an API request
        $isApiRequest = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
        
        if ($isApiRequest) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'veterinarians' => $data['veterinarians']]);
            exit;
        }

        $this->call->view('veterinarians', $data);
    }

    public function api_index()
    {
        header('Content-Type: application/json');
        
        if (session_status() !== PHP_SESSION_ACTIVE) {
            @session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'Not authenticated']);
            exit;
        }

        $veterinarians = $this->db->table('veterinarians')->get_all();

        echo json_encode(['success' => true, 'veterinarians' => $veterinarians]);
        exit;
    }
}
