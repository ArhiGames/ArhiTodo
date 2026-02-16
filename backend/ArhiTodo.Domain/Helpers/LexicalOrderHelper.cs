namespace ArhiTodo.Domain.Helpers;

public static class LexicalOrderHelper
{
    private const string Alphabet = "abcdefghijklmnopqrstuvw";

    public static string GetBetween(string? prev, string? next)
    {
        if (string.IsNullOrEmpty(prev)) prev = Alphabet[0].ToString();
        if (string.IsNullOrEmpty(next)) next = new string(Alphabet[^1], 1);

        string res = "";
        int i = 0;

        while (true)
        {
            char p = i < prev.Length ? prev[i] : Alphabet[0];
            char n = i < next.Length ? next[i] : Alphabet[^1];

            if (p == n)
            {
                res += p;
                i++;
                continue;
            }

            int pIndex = Alphabet.IndexOf(p);
            int nIndex = Alphabet.IndexOf(n);

            if (nIndex - pIndex > 1)
            {
                res += Alphabet[(pIndex + nIndex) / 2];
                break;
            }
            
            res += p;
            i++;
            if (i == prev.Length)
            {
                res += Alphabet[Alphabet.Length / 2];
                break;
            }
        }

        return res;
    }
}