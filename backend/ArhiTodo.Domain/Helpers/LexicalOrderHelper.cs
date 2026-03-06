namespace ArhiTodo.Domain.Helpers;

public static class LexicalOrderHelper
{
    private const int Base = 26;

    private static int CharToIndex(char c) => c - 'a';
    private static char IndexToChar(int i) => (char)('a' + i);

    public static string GetBetween(string? prev, string? next)
    {
        prev ??= "";
        next ??= "";

        int i = 0;
        string result = "";

        while (true)
        {
            int p = i < prev.Length ? CharToIndex(prev[i]) : 0;
            int n = i < next.Length ? CharToIndex(next[i]) : Base - 1;

            if (n - p > 1)
            {
                int mid = (p + n) / 2;
                return result + IndexToChar(mid);
            }

            result += IndexToChar(p);
            i++;
        }
    }
}