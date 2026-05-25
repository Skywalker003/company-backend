using System.Text.Json;
using System.Text.Json.Serialization;
namespace WebApplication1.Services;

public class DataStore
{
    private readonly string _dataDir;
    private static readonly JsonSerializerOptions _opts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public DataStore(IWebHostEnvironment env)
    {
        _dataDir = Path.Combine(env.ContentRootPath, "data");
        Directory.CreateDirectory(_dataDir);
    }

    private string FilePath(string key) => Path.Combine(_dataDir, $"{key}.json");

    // ── List operations ──────────────────────────────────────────────────────

    public List<T> GetAll<T>(string key)
    {
        var path = FilePath(key);
        if (!File.Exists(path)) return [];
        return JsonSerializer.Deserialize<List<T>>(File.ReadAllText(path), _opts) ?? [];
    }

    public T Add<T>(string key, T item)
    {
        var list = GetAll<T>(key);
        list.Add(item);
        File.WriteAllText(FilePath(key), JsonSerializer.Serialize(list, _opts));
        return item;
    }

    public bool Replace<T>(string key, int id, T updated)
    {
        var list = GetAll<T>(key);
        var idx  = list.FindIndex(x => GetIntId(x) == id);
        if (idx < 0) return false;
        list[idx] = updated;
        File.WriteAllText(FilePath(key), JsonSerializer.Serialize(list, _opts));
        return true;
    }

    public bool Delete<T>(string key, int id)
    {
        var list    = GetAll<T>(key);
        var removed = list.RemoveAll(x => GetIntId(x) == id);
        if (removed == 0) return false;
        File.WriteAllText(FilePath(key), JsonSerializer.Serialize(list, _opts));
        return true;
    }

    // String-ID overloads for PortfolioTopic
    public bool ReplaceByStringId<T>(string key, string id, T updated)
    {
        var list = GetAll<T>(key);
        var idx  = list.FindIndex(x => GetStringId(x) == id);
        if (idx < 0) return false;
        list[idx] = updated;
        File.WriteAllText(FilePath(key), JsonSerializer.Serialize(list, _opts));
        return true;
    }

    public bool DeleteByStringId<T>(string key, string id)
    {
        var list    = GetAll<T>(key);
        var removed = list.RemoveAll(x => GetStringId(x) == id);
        if (removed == 0) return false;
        File.WriteAllText(FilePath(key), JsonSerializer.Serialize(list, _opts));
        return true;
    }

    // ── Singleton operations ─────────────────────────────────────────────────

    public T? GetSingleton<T>(string key) where T : class
    {
        var path = FilePath(key);
        if (!File.Exists(path)) return null;
        return JsonSerializer.Deserialize<T>(File.ReadAllText(path), _opts);
    }

    public void SaveSingleton<T>(string key, T value)
        => File.WriteAllText(FilePath(key), JsonSerializer.Serialize(value, _opts));

    public string[] GetStringArray(string key)
    {
        var path = FilePath(key);
        if (!File.Exists(path)) return [];
        return JsonSerializer.Deserialize<string[]>(File.ReadAllText(path), _opts) ?? [];
    }

    public void SaveStringArray(string key, string[] value)
        => File.WriteAllText(FilePath(key), JsonSerializer.Serialize(value, _opts));

    // ── ID helpers ───────────────────────────────────────────────────────────

    private static int    GetIntId<T>(T x)    => (int)(typeof(T).GetProperty("Id")!.GetValue(x)!);
    private static string GetStringId<T>(T x) => (string)(typeof(T).GetProperty("Id")!.GetValue(x)!);

    public int NextId<T>(string key)
    {
        var list = GetAll<T>(key);
        if (list.Count == 0) return 1;
        return list.Max(x => GetIntId(x)) + 1;
    }
}
