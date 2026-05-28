use HTTP::Daemon;
use HTTP::Status;
use File::Basename;
use POSIX qw();

my $port = $ARGV[0] || 5500;
my $root = dirname(__FILE__);

my $d = HTTP::Daemon->new(LocalPort => $port, ReuseAddr => 1) or die "Cannot start: $!";
print "Server running at: ", $d->url, "\n";

while (my $c = $d->accept) {
    while (my $r = $c->get_request) {
        my $path = $r->url->path;
        $path = '/index.html' if $path eq '/';
        $path =~ s|/||;
        my $file = "$root/$path";
        if (-f $file) {
            my $type = 'text/plain';
            $type = 'text/html; charset=utf-8' if $file =~ /\.html$/;
            $type = 'text/css' if $file =~ /\.css$/;
            $type = 'application/javascript' if $file =~ /\.js$/;
            open my $fh, '<', $file or next;
            local $/;
            my $body = <$fh>;
            close $fh;
            $c->send_response(HTTP::Response->new(200, 'OK', ['Content-Type' => $type], $body));
        } else {
            $c->send_error(RC_NOT_FOUND);
        }
    }
    $c->close;
}
