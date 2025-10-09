<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap Index</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 10px; }
          th { background-color: #f0f0f0; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>XML Sitemap Index</h2>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="s:sitemapindex/s:sitemap">
            <tr>
              <td><Link href="{s:loc}"><xsl:value-of select="s:loc"/></Link></td>
              <td><xsl:value-of select="s:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
